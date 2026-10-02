pipeline {
    agent any

    tools {
        nodejs 'node24'
    }

    environment {
        POSTGRES_HOST = 'host.docker.internal'
        POSTGRES_PORT = '5433'
        POSTGRES_DB = 'taskhub'

        VPS_HOST = '51.83.154.177'
        VPS_USER = 'ubuntu'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    stages {
        stage('Environment') {
            steps {
                sh '''
                    echo "=== Java ==="
                    java -version

                    echo "=== Git ==="
                    git --version

                    echo "=== Working directory ==="
                    pwd
                '''
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Build & Test') {
            steps {
                dir('backend') {
                    sh 'chmod +x mvnw'

                    withCredentials([
                        usernamePassword(
                            credentialsId: 'taskhub-postgres',
                            usernameVariable: 'POSTGRES_USER',
                            passwordVariable: 'POSTGRES_PASSWORD'
                        )
                    ]) {
                        sh './mvnw clean package'
                    }
                }
            }
        }

        stage('Frontend - Environment') {
            steps {
                sh '''
                    echo "=== Node ==="
                    node --version

                    echo "=== npm ==="
                    npm --version
                '''
            }
        }

		stage('Frontend - Install') {
			steps {
				dir('frontend') {
					sh 'npm ci'
				}
			}
		}

	    stage('Frontend - OpenAPI') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'taskhub-postgres',
                        usernameVariable: 'POSTGRES_USER',
                        passwordVariable: 'POSTGRES_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -e

                        export JWT_SECRET="ci-test-secret-key-for-taskhub-12345678901234567890"

                        echo "Starting backend for OpenAPI generation on port 18080..."

                        java -jar backend/target/taskhub-0.0.1-SNAPSHOT.jar \
                            --server.port=18080 \
                            > backend-openapi.log 2>&1 &

                        BACKEND_PID=$!

                        cleanup() {
                            echo "Stopping temporary backend..."
                            kill $BACKEND_PID 2>/dev/null || true
                        }

                        trap cleanup EXIT

                        echo "Waiting for backend..."

                        for i in $(seq 1 30); do
                            if node -e "fetch('http://localhost:18080/v3/api-docs').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"; then
                                echo "Backend is ready."
                                break
                            fi

                            if [ "$i" -eq 30 ]; then
                                echo "Backend did not start."
                                cat backend-openapi.log
                                exit 1
                            fi

                            sleep 2
                        done

                        cd frontend

                        node openapi/scripts/download-spec.mjs \
                            http://localhost:18080/v3/api-docs \
                            openapi/taskhub-service/openapi.json

                        npm run openapi:taskhub:clean
                        npm run openapi:taskhub:generate
                    '''
                }
            }
        }

		stage('Frontend - Build') {
			steps {
				dir('frontend') {
					sh 'npm run build'
				}
			}
		}

		stage('SSH - Test VPS') {
            steps {
                sshagent(credentials: ['taskhub-vps-ssh']) {
                    sh '''
                        ssh \
                            -o StrictHostKeyChecking=accept-new \
                            "$VPS_USER@$VPS_HOST" \
                            'echo "=== VPS ===" && hostname && whoami'
                    '''
                }
            }
        }
    }

	post {
		always {
			junit 'backend/target/surefire-reports/*.xml'
		}

    success {
        archiveArtifacts(
            artifacts: 'backend/target/*.jar',
            fingerprint: true
        )

        archiveArtifacts(
            artifacts: 'frontend/dist/frontend/browser/**',
            fingerprint: true
        )

        echo 'TaskHub pipeline successful.'
    }

        failure {
            echo 'TaskHub pipeline failed.'
        }
	}
}