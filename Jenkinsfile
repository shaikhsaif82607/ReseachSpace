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
                echo 'Testing ReseachSpace...'
            }
        }
    }
}