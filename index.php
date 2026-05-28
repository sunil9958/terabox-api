<?php

$url = "https://dm.1024terabox.com/api/download";

$params = [
    "app_id"     => "250528",
    "web"        => "1",
    "channel"    => "dubox",
    "clienttype" => "0",
    "jsToken"    => "50D1EA8941B2ADAE289F5B614387D731B8A98DAFA58D0"
];

$finalUrl = $url . "?" . http_build_query($params);

$cookie = 'browserid=Mhog7GSRmGPfdtYsVMYZUlYiE_1jmXFJs28mbjoHaRUCIgv4va0WYK7tWz8=;
lang=en;
TSID=0G36PmBYszpDyahXpOmmFU8lCpavjqLm;
bid_n=19e6ec5e157acdd6f54207;
afUserId=952a3cb3-d709-46f1-bfa6-1f2754cf6ddf-p;
csrfToken=kyjSumT4iFzt2HxBt-2zt4ds;
ndus=Yb3oCB1peHuiqgBlmdGOOZMRKWVx82EXiW3UU9h_;';

$headers = [
    "Accept: application/json, text/plain, */*",
    "Origin: https://www.terabox.com",
    "Referer: https://www.terabox.com/",
    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/136.0 Safari/537.36",
    "Cookie: " . $cookie
];

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $finalUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo "cURL Error: " . curl_error($ch);
} else {

    $json = json_decode($response, true);

    echo "<pre>";
    print_r($json);
    echo "</pre>";
}

curl_close($ch);

?>
