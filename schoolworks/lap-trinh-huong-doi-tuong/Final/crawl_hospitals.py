import urllib.request
import urllib.parse
import re
import json
import csv
import time
import random
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def get_base_pb():
    try:
        with open("gmaps_response.html", "r", encoding="utf-8") as f:
            html = f.read()
    except Exception as e:
        print("Fetching initial Google Maps search page to extract base pb...")
        url = "https://www.google.com/maps/search/cafes+in+District+7,+Ho+Chi+Minh+City/"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
        }
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req) as response:
                html = response.read().decode('utf-8')
                with open("gmaps_response.html", "w", encoding="utf-8") as f_out:
                    f_out.write(html)
        except Exception as ex:
            print("Error fetching base page:", ex)
            return None
            
    match = re.search(r'<link\s+href="(/search\?tbm=map[^"]+)"\s+as="fetch"', html)
    if not match:
        print("Could not find preload link in gmaps_response.html.")
        return None
        
    href = match.group(1).replace('&amp;', '&')
    parsed_url = urllib.parse.urlparse(href)
    query_params = urllib.parse.parse_qs(parsed_url.query)
    return query_params.get('pb', [''])[0]

def fetch_hospitals_for_query(pb_base, query, offset):
    url = "https://www.google.com/search"
    original_query = "cafes in District 7, Ho Chi Minh City"
    
    pb_val = pb_base.replace(original_query, query)
    if "!7i20" in pb_val:
        pb_val = pb_val.replace("!7i20", f"!7i20!8i{offset}")
        
    params = {
        'tbm': 'map',
        'authuser': '0',
        'hl': 'vi',
        'gl': 'tw',
        'q': query,
        'pb': pb_val
    }
    
    query_string = urllib.parse.urlencode(params, doseq=True)
    fetch_url = f"{url}?{query_string}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
        'Referer': f"https://www.google.com/maps/search/{urllib.parse.quote(query)}/",
    }
    
    req = urllib.request.Request(fetch_url, headers=headers)
    
    try:
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
            if content.startswith(")]}'"):
                content = content[4:].strip()
            else:
                content = content.strip()
                
            data = json.loads(content)
            hospitals = []
            
            if len(data) > 64 and data[64] is not None:
                for item in data[64]:
                    if len(item) > 1 and item[1] is not None:
                        details = item[1]
                        name = details[11] if len(details) > 11 else None
                        if not name:
                            continue
                            
                        # Coordinates
                        lat = details[9][2] if len(details) > 9 and details[9] and len(details[9]) > 2 else None
                        lon = details[9][3] if len(details) > 9 and details[9] and len(details[9]) > 3 else None
                        
                        # Address
                        addr = details[18] if len(details) > 18 and details[18] else (
                            details[39] if len(details) > 39 and details[39] else ''
                        )
                        
                        # Rating
                        rating = None
                        if len(details) > 4 and details[4] and len(details[4]) > 7:
                            rating = details[4][7]
                            
                        # Categories
                        categories = details[13] if len(details) > 13 else []
                        
                        # Place ID
                        place_id = details[78] if len(details) > 78 else None
                        maps_url = f"https://www.google.com/maps/place/?q=place_id:{place_id}" if place_id else ""
                        
                        hospitals.append({
                            'name': name,
                            'latitude': lat,
                            'longitude': lon,
                            'address': addr,
                            'rating': rating,
                            'categories': ", ".join(categories) if categories else "Bệnh viện",
                            'place_id': place_id,
                            'url': maps_url
                        })
            return hospitals
    except Exception as e:
        print(f"Error fetching '{query}' offset {offset}: {e}")
        return []

def is_in_district_7(item):
    lat = item.get('latitude')
    lon = item.get('longitude')
    addr = item.get('address', '').lower()
    
    if lat is None or lon is None:
        return False
        
    # Check bounding box
    in_bbox = (10.69779 <= lat <= 10.77740) and (106.69019 <= lon <= 106.76679)
    if not in_bbox:
        return False
        
    # Check keywords
    d7_keywords = ["quận 7", "district 7", "q7", "q.7", "phú mỹ hưng", "phu my hung"]
    in_address = any(kw in addr for kw in d7_keywords)
    
    d7_wards = ["tân thuận đông", "tân thuận tây", "tân kiểng", "tân hưng", "bình thuận", 
                "tân phong", "tân phú", "tân quy", "phú thuận", "phú mỹ"]
    in_wards = any(ward in addr for ward in d7_wards)
    
    q7_streets = ["nguyễn thị thập", "huỳnh tấn phát", "nguyễn văn linh", "lê văn lương", "trần xuân soạn", "nguyễn hữu thọ"]
    in_streets = any(street in addr for street in q7_streets)
    
    return in_address or in_wards or in_streets

def save_to_excel(hospitals_dict, xlsx_file):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Hospitals District 7"
    
    # Styles
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="9C27B0", end_color="9C27B0", fill_type="solid") # Deep Purple
    header_align = Alignment(horizontal="center", vertical="center", wrap_text=True)
    
    cell_font = Font(name="Calibri", size=11, bold=False)
    cell_align_left = Alignment(horizontal="left", vertical="center")
    cell_align_center = Alignment(horizontal="center", vertical="center")
    
    thin_border = Border(
        left=Side(style='thin', color='D3D3D3'),
        right=Side(style='thin', color='D3D3D3'),
        top=Side(style='thin', color='D3D3D3'),
        bottom=Side(style='thin', color='D3D3D3')
    )
    
    headers = ["Name", "Latitude", "Longitude", "Address", "Categories", "Rating", "Google Maps URL"]
    ws.append(headers)
    
    # Header format
    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = header_align
        cell.border = thin_border
    ws.row_dimensions[1].height = 28
    
    row_num = 2
    for key, hospital in hospitals_dict.items():
        row_data = [
            hospital['name'],
            hospital['latitude'],
            hospital['longitude'],
            hospital['address'],
            hospital['categories'],
            hospital['rating'] if hospital['rating'] is not None else '',
            hospital['url']
        ]
        ws.append(row_data)
        
        # Format cells
        for col_idx in range(1, len(row_data) + 1):
            cell = ws.cell(row=row_num, column=col_idx)
            cell.font = cell_font
            cell.border = thin_border
            
            if col_idx in (2, 3, 6): # Lat, Lon, Rating
                cell.alignment = cell_align_center
            else:
                cell.alignment = cell_align_left
        ws.row_dimensions[row_num].height = 20
        row_num += 1
        
    # Auto-adjust columns
    for col in ws.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            val = str(cell.value or '')
            if cell.column == 7: # URL
                max_len = max(max_len, min(len(val), 20))
            else:
                max_len = max(max_len, len(val))
        ws.column_dimensions[col_letter].width = max(max_len + 3, 10)
        
    wb.save(xlsx_file)

def main():
    pb_base = get_base_pb()
    if not pb_base:
        print("Failed to get base pb.")
        return
        
    # All 10 wards of District 7
    wards = [
        "Tân Hưng", "Tân Phong", "Tân Quy", "Tân Kiểng", 
        "Tân Thuận Đông", "Tân Thuận Tây", "Bình Thuận",
        "Tân Phú", "Phú Mỹ", "Phú Thuận"
    ]
    
    # User's requested keywords: hospital, bệnh viện, phòng khám, phòng khám đa khoa, trạm y tế, trung tâm y tế, clinic
    search_keywords = [
        "bệnh viện",
        "hospital",
        "phòng khám đa khoa",
        "phòng khám",
        "clinic",
        "trung tâm y tế",
        "trạm y tế"
    ]
    
    # Generate all query combinations
    queries = []
    
    # 1. Broad queries for whole District 7
    for kw in search_keywords:
        queries.append(f"{kw} tại Quận 7, Hồ Chí Minh")
        queries.append(f"{kw} in District 7, Ho Chi Minh City")
        
    # 2. Ward level queries
    for ward in wards:
        for kw in ["bệnh viện", "hospital", "phòng khám", "clinic"]:
            queries.append(f"{kw} tại {ward}, Quận 7, Hồ Chí Minh")
            
    # De-duplicate queries list
    queries = list(set(queries))
    
    all_hospitals = {}
    
    print(f"Starting exhaustive crawl for hospitals and clinics ({len(queries)} query tasks)...")
    for idx, query in enumerate(queries):
        print(f"\n[{idx+1}/{len(queries)}] Querying: '{query}'...")
        
        # Check offset 0 and 20 for broad queries to fetch more pages
        offsets = [0, 20] if "Quận 7" in query and len(query) < 45 else [0]
        
        for offset in offsets:
            items = fetch_hospitals_for_query(pb_base, query, offset)
            print(f"  Found {len(items)} raw results.")
            
            for item in items:
                key = item['place_id'] if item['place_id'] else f"{item['name']}_{item['latitude']}_{item['longitude']}"
                
                # Check if it is in District 7
                if is_in_district_7(item):
                    if key not in all_hospitals:
                        # Exclude pharmacies or pure dental cosmetic shops if they clutter
                        name_lower = item['name'].lower()
                        if "nhà thuốc" in name_lower or "pharmacy" in name_lower:
                            continue
                        all_hospitals[key] = item
            
            # Politeness delay
            time.sleep(random.uniform(0.8, 1.8))
            
    # Export to CSV
    csv_file = "hospitals_district_7.csv"
    with open(csv_file, mode='w', encoding='utf-8-sig', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Name", "Latitude", "Longitude", "Address", "Categories", "Rating", "Google Maps URL"])
        for key, h in all_hospitals.items():
            writer.writerow([
                h['name'], h['latitude'], h['longitude'], h['address'], h['categories'], 
                h['rating'] if h['rating'] is not None else '', h['url']
            ])
            
    # Export to Excel
    xlsx_file = "hospitals_district_7.xlsx"
    save_to_excel(all_hospitals, xlsx_file)
    
    print(f"\n==================================================")
    print(f"Exhaustive Hospital Crawl Completed successfully!")
    print(f"Total unique District 7 hospitals/clinics saved: {len(all_hospitals)}")
    print(f"CSV file: {csv_file}")
    print(f"Excel file: {xlsx_file}")
    print(f"==================================================")

if __name__ == "__main__":
    main()
