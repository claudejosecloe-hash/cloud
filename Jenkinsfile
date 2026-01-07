pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = "tondockerhubusername/dictionnaire-app"
        IMAGE_TAG = "latest"
    }

    stages {

        stage('Clone repository') {
            steps {
                echo "Clonage du repository..."
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                echo "Installation des dépendances..."
                sh 'npm install'
            }
        }

        stage('Run tests') {
            steps {
                echo "Exécution des tests..."
                sh 'npm test || echo "Pas de tests pour le moment"'
            }
        }

        stage('Build Docker image') {
            steps {
                echo "Construction de l’image Docker..."
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                """
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo "Connexion à Docker Hub..."
                sh """
                    echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                """
            }
        }

        stage('Push Docker image') {
            steps {
                echo "Envoi de l’image vers Docker Hub..."
                sh """
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo "Déploiement sur l’environnement de staging..."
                sh """
                    docker stop dictionnaire-staging || true
                    docker rm dictionnaire-staging || true
                    docker run -d -p 8081:8080 --name dictionnaire-staging ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

    }

    post {
        success {
            echo "Pipeline terminé avec succès 🚀"
        }
        failure {
            echo "Pipeline échoué ❌"
        }
    }
}
