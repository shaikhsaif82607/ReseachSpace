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
                bat 'ping 127.0.0.1 -n 6 > nul'
                bat 'curl http://localhost:8083'
                bat 'docker stop reseachspace-test'
            }
        }
    }
}