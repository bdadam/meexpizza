<?php
    header('Content-Type: application/json');

    $MONGOLAB_API_KEY = 'XXXXXXXXXXXXXX';
    $DB = 'meexpizzaweb';
    $COLLECTION = 'order';

    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $notes = $_POST['notes'];

    $milliseconds = round(microtime(true) * 1000);
    $data = json_encode(
        array(
            "name" => $name,
            "email" => $email,
            "phone" => $phone,
            "notes" => $notes,
            // see http://www.mongodb.org/display/DOCS/Mongo+Extended+JSON
            "date" => array('$date' => $milliseconds)
        )
    );

    $url = "https://api.mongolab.com/api/1/databases/$DB/collections/$COLLECTION?apiKey=$MONGOLAB_API_KEY";

    try {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data),
        ));

        $response = curl_exec($ch);
        $error = curl_error($ch);
        $response_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        echo json_encode(array(
            "ok" => true
        ));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array(
            "ok" => false
        ));
    }
?>
