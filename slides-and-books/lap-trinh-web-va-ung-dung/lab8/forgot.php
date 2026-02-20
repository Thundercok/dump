<?php
require_once('account_db.php');
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
$error = '';
$email = '';
$success = '';
if (isset($_POST['email'])) {
    $email = $_POST['email'];

    if (empty($email)) {
        $error = 'Please enter your email';
    } else if (filter_var($email, FILTER_VALIDATE_EMAIL) == false) {
        $error = 'This is not a valid email address';
    } else {
        $a = array();
        $a = create_token($email);
        if ($a[0]) {
            $mail = new PHPMailer(true);
            try {
                // Server settings
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'kenvinhkhangta@gmail.com';      // Your Gmail
                $mail->Password = 'neuu xeup xpjz prso';         // Gmail app password
                $mail->SMTPSecure = 'tls';
                $mail->Port = 587;

                // Recipients
                $mail->setFrom('kenvinhkhangta@gmail.com', 'Lab08');
                $mail->addAddress($email);

                // Email content
                $mail->isHTML(true);
                $mail->Subject = 'Reset Password';
                $link = 'http://localhost/lab8/reset_password.php';
                $mail->Body = "Click the this button to reset your password: <form action='$link' method='POST'><input type='hidden' name='email' value='$email'><input type='hidden' name='token' value='$token'><button type='submit'>Click here</button></form>";

                $mail->send();
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        } else {
            $error = "Error in creating a token";
        }
    }
}
?>

<DOCTYPE html>
    <html lang="en">

    <head>
        <title>Reset user password</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    </head>

    <body>

        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <h3 class="text-center text-secondary mt-5 mb-3">Reset Password</h3>
                    <form method="post" action="" class="border rounded w-100 mb-5 mx-auto px-3 pt-3 bg-light">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input name="email" id="email" type="text" class="form-control" placeholder="Email address">
                        </div>
                        <div class="form-group">
                            <p>If your email exists in the database, you will receive an email containing the reset
                                password instructions.</p>
                        </div>
                        <div class="form-group">
                            <?php
                            if (!empty($error)) {
                                echo "<div class='alert alert-danger'>$error</div>";
                            } else if (!empty($success)) {
                                echo "<div class='alert alert-success' role='alert'>Email sent!</div>";
                            }
                            ?>
                            <button class="btn btn-success px-5">Reset password</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>

    </body>

    </html>