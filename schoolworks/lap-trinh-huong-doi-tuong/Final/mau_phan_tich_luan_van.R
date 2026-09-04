# ==============================================================================
# TEMPLATE PHÂN TÍCH DỮ LIỆU LUẬN VĂN / BÀI BÁO KHOA HỌC BẰNG R
# Quy trình chuẩn: Đọc file SPSS (.sav) -> Cronbach's Alpha -> EFA -> CFA & SEM -> Xuất Word
# ==============================================================================

# 1. NẠP CÁC THƯ VIỆN ĐÃ ĐƯỢC SETUP SẴN
library(haven)        # Đọc file .sav từ SPSS: read_sav("file.sav")
library(tidyverse)    # Xử lý số liệu, chọn lọc biến, vẽ biểu đồ
library(psych)        # Kiểm định Cronbach's Alpha & EFA
library(lavaan)       # Phân tích CFA, SEM & Biến trung gian (Mediation với Bootstrap)
library(semPlot)      # Vẽ sơ đồ đường dẫn mô hình SEM (Thay thế AMOS)
library(flextable)    # Định dạng bảng chuẩn APA
library(officer)      # Xuất bảng trực tiếp sang file Word (.docx)

# ==============================================================================
# 2. ĐỌC DỮ LIỆU CỦA BẠN
# ==============================================================================
# Nếu dùng file SPSS thực tế của bạn, hãy bỏ comment dòng dưới:
# df <- read_sav("du_lieu_khao_sat.sav")

# Dữ liệu giả lập mẫu (N = 300) chuẩn thang đo Likert 1-5 để chạy thử nghiệm:
set.seed(42)
n <- 300
X_latent <- rnorm(n, 0, 1)
M_latent <- 0.6 * X_latent + rnorm(n, 0, sqrt(1 - 0.6^2))
Y_latent <- 0.5 * M_latent + 0.3 * X_latent + rnorm(n, 0, 0.5)

X1 <- round(pmax(1, pmin(5, 3 + 0.80 * X_latent + rnorm(n, 0, 0.4))))
X2 <- round(pmax(1, pmin(5, 3 + 0.85 * X_latent + rnorm(n, 0, 0.4))))
X3 <- round(pmax(1, pmin(5, 3 + 0.75 * X_latent + rnorm(n, 0, 0.4))))

M1 <- round(pmax(1, pmin(5, 3 + 0.80 * M_latent + rnorm(n, 0, 0.4))))
M2 <- round(pmax(1, pmin(5, 3 + 0.85 * M_latent + rnorm(n, 0, 0.4))))
M3 <- round(pmax(1, pmin(5, 3 + 0.78 * M_latent + rnorm(n, 0, 0.4))))

Y1 <- round(pmax(1, pmin(5, 3 + 0.82 * Y_latent + rnorm(n, 0, 0.4))))
Y2 <- round(pmax(1, pmin(5, 3 + 0.88 * Y_latent + rnorm(n, 0, 0.4))))
Y3 <- round(pmax(1, pmin(5, 3 + 0.80 * Y_latent + rnorm(n, 0, 0.4))))

df <- data.frame(X1, X2, X3, M1, M2, M3, Y1, Y2, Y3)

# ==============================================================================
# 3. ĐỘ TIN CẬY THANG ĐO (CRONBACH'S ALPHA)
# ==============================================================================
cat("\n========================================================\n")
cat(" 3. KIỂM ĐỊNH ĐỘ TIN CẬY THANG ĐO (CRONBACH'S ALPHA)\n")
cat("========================================================\n")
alpha_X <- psych::alpha(df[, c("X1", "X2", "X3")], check.keys = TRUE)
cat("Cronbach's Alpha Thang đo X:", round(alpha_X$total$raw_alpha, 3), "\n")

alpha_M <- psych::alpha(df[, c("M1", "M2", "M3")], check.keys = TRUE)
cat("Cronbach's Alpha Thang đo M:", round(alpha_M$total$raw_alpha, 3), "\n")

alpha_Y <- psych::alpha(df[, c("Y1", "Y2", "Y3")], check.keys = TRUE)
cat("Cronbach's Alpha Thang đo Y:", round(alpha_Y$total$raw_alpha, 3), "\n")

# ==============================================================================
# 4. PHÂN TÍCH NHÂN TỐ KHÁM PHÁ (EFA)
# ==============================================================================
cat("\n========================================================\n")
cat(" 4. PHÂN TÍCH NHÂN TỐ KHÁM PHÁ (EFA)\n")
cat("========================================================\n")
kmo_res <- KMO(df)
cat("Hệ số KMO tổng thể:", round(kmo_res$MSA, 3), "(Đạt yêu cầu > 0.5)\n")

# Chạy EFA trích 3 nhân tố với phép xoay Varimax
efa_result <- fa(df, nfactors = 3, rotate = "varimax", fm = "pa")
print(efa_result$loadings, cutoff = 0.4)

# ==============================================================================
# 5. PHÂN TÍCH CFA & SEM VÀ BIẾN TRUNG GIAN (THAY THẾ AMOS & PROCESS MACRO)
# ==============================================================================
cat("\n========================================================\n")
cat(" 5. MÔ HÌNH SEM & KIỂM ĐỊNH BIẾN TRUNG GIAN (LAVAAN)\n")
cat("========================================================\n")

model_sem <- '
  # 1. Mô hình đo lường (CFA)
  X =~ X1 + X2 + X3
  M =~ M1 + M2 + M3
  Y =~ Y1 + Y2 + Y3

  # 2. Mô hình cấu trúc (Structural Model)
  M ~ a * X
  Y ~ b * M + c_prime * X

  # 3. Tính toán tác động trung gian (Bootstrapping)
  Indirect_Effect := a * b
  Direct_Effect   := c_prime
  Total_Effect    := Direct_Effect + (a * b)
'

# Ước lượng mô hình SEM với Bootstrap 500 mẫu
fit <- sem(model_sem, data = df, se = "bootstrap", bootstrap = 500)

cat("\n--- ĐỘ PHÙ HỢP CỦA MÔ HÌNH (MODEL FIT INDICES) ---\n")
print(fitMeasures(fit, c("chisq", "df", "pvalue", "cfi", "tli", "rmsea", "srmr")))

cat("\n--- BẢNG HỆ SỐ HỒI QUY & TÁC ĐỘNG TRUNG GIAN ---\n")
summary(fit, standardized = TRUE, fit.measures = FALSE, rsquare = TRUE)

# ==============================================================================
# 6. XUẤT BẢNG KẾT QUẢ SANG FILE WORD (.DOCX) CHUẨN APA
# ==============================================================================
param_df <- parameterEstimates(fit, standardized = TRUE) %>%
  filter(op %in% c("~", ":=")) %>%
  select(Biến_Nguồn = lhs, Quan_Hệ = op, Biến_Đích = rhs, 
         Estimate = est, Beta_ChuanHoa = std.all, SE = se, Z = z, P_value = pvalue,
         CI_95_Lower = ci.lower, CI_95_Upper = ci.upper)

doc_table <- flextable(param_df) %>%
  theme_vanilla() %>%
  autofit()

doc <- read_docx() %>%
  body_add_par("BẢNG KẾT QUẢ MÔ HÌNH SEM & KIỂM ĐỊNH BIẾN TRUNG GIAN (APA 7th)", style = "heading 1") %>%
  body_add_flextable(doc_table)

output_file <- "Ket_Qua_SEM_Luan_Van.docx"
print(doc, target = output_file)
cat("\n>>> ĐÃ XUẤT THÀNH CÔNG BẢNG KẾT QUẢ SANG FILE WORD:", output_file, "<<<\n")
