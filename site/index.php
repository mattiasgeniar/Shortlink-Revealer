<?php
	// Add good headers
	header("Content-Type: application/xml");

	// Top level of the XML
	echo "<UrlshortlinkRevealer>";

        // Process the request
        $url = $_GET['url_check'];

        if (strlen($url) < 5) {
                die();
        } else {
                # Open the URL and fetch the headers only
                $ch = curl_init();              
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_HEADER, TRUE);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
                curl_setopt($ch, CURLOPT_NOBODY, TRUE);		// No body
                $head = curl_exec($ch);
                $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		// We have the code
		if ($code == 301 || $code == 302) {
			// It's a redirect
			$arrHeaders = explode("\n", $head);
			$location = "";
			foreach ($arrHeaders as $header) {
				if (preg_match("/Location:/", $header)) {
					$location = trim(str_replace("Location: ","", $header));
				}
			}

			echo "<statuscode>". $code ."</statuscode>";
			echo "<location>". $location ."</location>";
		} else {
			// No redirect
			echo "<statuscode>200</statuscode>";
		}
        }

	// Top level of the XML
	echo "</UrlshortlinkRevealer>";
?>
