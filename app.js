const http = require('http');
const fs = require('fs');
const url = require('url');

// Charger le dictionnaire
const dictionnaire = JSON.parse(
  fs.readFileSync('dictionnaire.json', 'utf8')
);

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // PAGE PRINCIPALE (INTERFACE)
  if (parsedUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Mini Dictionnaire</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f4f6f8;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .box {
            background: white;
            padding: 30px;
            border-radius: 8px;
            width: 400px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            text-align: center;
          }
          input {
            width: 80%;
            padding: 10px;
            margin-bottom: 10px;
          }
          button {
            padding: 10px 20px;
            cursor: pointer;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
          }
          #resultat {
            margin-top: 15px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h2>📘 Mini dictionnaire</h2>
          <input type="text" id="mot" placeholder="Entrez un mot" />
          <br>
          <button onclick="chercher()">Rechercher</button>
          <div id="resultat"></div>
        </div>

        <script>
          function chercher() {
            const mot = document.getElementById('mot').value;
            fetch('/definition?mot=' + mot)
              .then(res => res.text())
              .then(data => {
                document.getElementById('resultat').innerText = data;
              });
          }
        </script>
      </body>
      </html>
    `);
  }

  // API DE DÉFINITION
  else if (parsedUrl.pathname === '/definition') {
    const mot = parsedUrl.query.mot?.toLowerCase();

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

    if (!mot) {
      res.end('Veuillez entrer un mot.');
    } else if (dictionnaire[mot]) {
      res.end(`${mot} : ${dictionnaire[mot]}`);
    } else {
      res.end(`Le mot "${mot}" n'existe pas dans le dictionnaire.`);
    }
  }

  // AUTRES URL
  else {
    res.writeHead(404);
    res.end('Page non trouvée');
  }
});

server.listen(3000, () => {
  console.log('Application lancée sur http://localhost:3000');
});
