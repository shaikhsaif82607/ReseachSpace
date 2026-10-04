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
                bat 'timeout /t 5'
                bat 'curl http://localhost:8083'
                bat 'docker stop reseachspace-test'
            }
        }
    }
}