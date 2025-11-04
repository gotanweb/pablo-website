<?php
// Set response content type to JSON
header('Content-Type: application/json');

// Function to sanitize input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Initialize response array
    $response = array();
    
    try {
        // Get and sanitize form data
        $name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
        $subject = isset($_POST['subject']) ? sanitizeInput($_POST['subject']) : '';
        $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
        $message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';
        
        // Validation
        if (empty($name) || empty($subject) || empty($email) || empty($message)) {
            throw new Exception("All fields are required.");
        }
        
        if (!validateEmail($email)) {
            throw new Exception("Invalid email address.");
        }
        
        if (strlen($name) < 2 || strlen($name) > 50) {
            throw new Exception("Name must be between 2 and 50 characters.");
        }
        
        if (strlen($subject) < 5 || strlen($subject) > 100) {
            throw new Exception("Subject must be between 5 and 100 characters.");
        }
        
        if (strlen($message) < 10 || strlen($message) > 1000) {
            throw new Exception("Message must be between 10 and 1000 characters.");
        }

        $humanCheck = isset($_POST['humanCheck']) ? $_POST['humanCheck'] : '';
        if ($humanCheck != '1') {
            throw new Exception("You must confirm that you are not a robot.");
        }
        
        // Email configuration
        $to = "pablo.londero88@gmail.com";
        $email_subject = "New message from plondero.com: " . $subject;
        
        // Email body
        $email_body = "You have received a new message from your website contact form.\n\n";
        $email_body .= "Name: " . $name . "\n";
        $email_body .= "Email: " . $email . "\n";
        $email_body .= "Subject: " . $subject . "\n\n";
        $email_body .= "Message:\n" . $message . "\n\n";
        $email_body .= "---\n";
        $email_body .= "This message was sent from: " . $_SERVER['HTTP_HOST'] . "\n";
        $email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
        $email_body .= "Date: " . date('Y-m-d H:i:s') . "\n";
        
        // Email headers
        $headers = "From: no-reply@" . $_SERVER['HTTP_HOST'] . "\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        // Send email
        if (mail($to, $email_subject, $email_body, $headers)) {
            $response['success'] = true;
            $response['message'] = "Message sent successfully! Thank you for contacting me.";
        } else {
            throw new Exception("Failed to send email. Please try again later.");
        }
        
    } catch (Exception $e) {
        $response['success'] = false;
        $response['message'] = $e->getMessage();
    }
    
    // Return JSON response
    echo json_encode($response);
    
} else {
    // If not POST request
    $response['success'] = false;
    $response['message'] = "Invalid request method.";
    echo json_encode($response);
}

// Prevent any additional output
exit;
?>