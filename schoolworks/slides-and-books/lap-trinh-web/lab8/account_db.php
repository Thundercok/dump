<?php
require_once('db.php');
function login($username, $password)
{
    $conn = create_connection();
    $sql = "select * from account where username = ?";
    $stm = $conn->prepare($sql);
    $stm->bind_param("s", $username);
    if (!$stm->execute())
        return "Cannot login due to error";
    $result = $stm->get_result();
    if ($result->num_rows !== 1)
        return "Invalid username";
    $data = $result->fetch_assoc();
    $hashed = $data['password'];
    if (!password_verify($password, $hashed))
        return "Invalid password";
    $activated = $data["activated"];
    if ($activated === 0)
        return "This account has not been activated yet";
    return true;
}

function register($username, $firstname, $lastname, $email, $password)
{
    $sql = "select count(*) from account where username = ? or email = ?";
    $conn = create_connection();
    $stm = $conn->prepare($sql);
    $stm->bind_param("ss", $username, $email);
    $stm->execute();
    $result = $stm->get_result();
    $exists = $result->fetch_array()[0] === 1;
    if ($exists) {
        return "This username or email already exists";
    }

    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $token = bin2hex(random_bytes(16));
    $sql = "insert into account(username, firstname, lastname, email, password, activated, activate_token) values (?,?,?,?,?,0,'$token')";
    $stm = $conn->prepare($sql);
    $stm->bind_param("sssss", $username, $firstname, $lastname, $email, $hashed);
    if ($stm->execute()) {
        return [true, $token];
    }
    return [$stm->error, ''];
}

function reset_password($email, $token, $password)
{
    $conn = create_connection();
    $sql = "select * from reset_token where token = ?";
    $stm = $conn->prepare($sql);
    $stm->bind_param("s", $token);
    if (!$stm->execute())
        return "Cannot find token due to error";
    $result = $stm->get_result();
    if ($result->num_rows !== 1)
        return "Invalid token";
    $data = $result->fetch_assoc();
    if ($data['expire_on'] <= 0)
        return "Token expired";
    $stm = $conn->prepare("delete from reset_token WHERE token = ?");
    $stm->bind_param("s", $token);
    $stm->execute();
    $newPassword = password_hash($password, PASSWORD_DEFAULT);
    $stm = $conn->prepare("UPDATE account SET password = ? WHERE email = ?");
    $stm->bind_param("ss", $newPassword, $token);
    if ($stm->execute([$newPassword, $data['email']])) {
        return true;
    } else {
        return "Cannot update password";
    }
}

function create_token($email)
{
    $conn = create_connection();
    $len = 100000;
    $token = bin2hex(random_bytes(16));
    $sql = "insert into reset_token values (?,?,?)";
    $stm = $conn->prepare($sql);
    $stm->bind_param("ssi", $email, $token, $len);
    if ($stm->execute()) {
        return [true, $token];
    } else {
        return [false, ''];
    }
}
?>