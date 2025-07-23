<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Metronic Chatbot</title>
    
    <!-- Metronic Theme CSS -->
    <link rel="stylesheet" href="<?= asset_url('plugins/global/plugins.bundle.css') ?>">
    <link rel="stylesheet" href="<?= asset_url('css/style.bundle.css') ?>">
    
    <!-- Chatbot CSS -->
    <link rel="stylesheet" href="<?= asset_url('css/chatbot.css') ?>">
    
    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700">
</head>
<body>
    <!-- Main Content -->
    <div class="d-flex flex-column flex-root">
        <?= $content ?>
    </div>
    
    <!-- Metronic Theme JS -->
    <script src="<?= asset_url('plugins/global/plugins.bundle.js') ?>"></script>
    <script src="<?= asset_url('js/scripts.bundle.js') ?>"></script>
    
    <!-- Chatbot JS -->
    <script src="<?= asset_url('js/chatbot.js') ?>"></script>
</body>
</html>