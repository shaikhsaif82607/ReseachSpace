pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building ReseachSpace Docker image...'
                bat 'docker build -t reseachspace .'
            }
        }

        stage('Test') {
            steps {
                echo 'Testing ReseachSpace Docker image...'
                bat 'docker run --rm -d --name reseachspace-test -p 8083:80 reseachspace'
                bat 'powershell -NoProfile -Command "Start-Sleep -Seconds 5"'
                bat 'curl.exe --fail http://localhost:8083'
                bat 'docker stop reseachspace-test'
            }
        }

        stage('Docker') {
            steps {
                echo 'Starting ReseachSpace Docker environment...'
                docker compose up -d --build --force-recreate
            }
        }
    }
}