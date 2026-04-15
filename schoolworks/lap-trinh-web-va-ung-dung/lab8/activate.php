<?php
require 'db.php';

$token = $_GET['token'] ?? '';

$conn = create_connection();
$sql = "select * from account where activate_token = ?";
$stm = $conn->prepare($sql);
$stm->bind_param("s", $token);
$stm->execute();
$result = $stm->get_result();
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <title>Kích hoạt tài khoản</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
    integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</head>

<body>
  <div class="container">
    <?php
    if (!($result->num_rows !== 1)) {
      $stm = $conn->prepare("UPDATE account SET activated = ? WHERE activate_token = ?");
      $stm->execute([1, $token]);
      ?>
      <div class="row">
        <div class="col-md-6 mt-5 mx-auto p-3 border rounded">
          <h4>Account Activation</h4>
          <p class="text-success">Congratulations! Your account has been activated.</p>
          <p>Click <a href="login.php">here</a> to login and manage your account information.</p>
          <a class="btn btn-success px-5" href="login.php">Login</a>
        </div>
      </div>
    <?php } else { ?>
      <div class="row">
        <div class="col-md-6 mt-5 mx-auto p-3 border rounded">
          <h4>Account Activation</h4>
          <p class="text-danger">This is not a valid url or it has been expired.</p>
          <p>Click <a href="login.php">here</a> to login.</p>
          <a class="btn btn-success px-5" href="login.php">Login</a>
        </div>
      </div>
    <?php } ?>
  </div>
</body>

</html>