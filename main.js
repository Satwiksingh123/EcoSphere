let ecoCredits = 0;
        let treesPlanted = 0;
        let plasticReduced = 0;
        let carbonOffset = 0;
        let level = 1;
        let badges = [];

        const badgeData = {
            'tree_hugger': { name: 'Tree Hugger', icon: '🌳', description: 'Plant 10 trees' },
            'plastic_warrior': { name: 'Plastic Warrior', icon: '♻️', description: 'Reduce 50kg of plastic' },
            'energy_saver': { name: 'Energy Saver', icon: '💡', description: 'Offset 100kg of carbon' },
            'eco_champion': { name: 'Eco Champion', icon: '🏆', description: 'Reach level 10' },
            'challenge_master': { name: 'Challenge Master', icon: '🎯', description: 'Complete 5 challenges' }
        };

        function updateDashboard() {
            document.getElementById('ecoCredits').textContent = ecoCredits;
            document.getElementById('treesPlanted').textContent = treesPlanted;
            document.getElementById('plasticReduced').textContent = plasticReduced.toFixed(2);
            document.getElementById('carbonOffset').textContent = carbonOffset.toFixed(2);
            updateLevel();
        }

        function updateLevel() {
            const newLevel = Math.floor(ecoCredits / 100) + 1;
            if (newLevel > level) {
                level = newLevel;
                showAchievement(`Congratulations! You've reached Level ${level}!`);
            }
            const progress = (ecoCredits % 100) / 100 * 100;
            document.getElementById('level-progress').style.width = `${progress}%`;
            document.getElementById('level-indicator').textContent = `Level ${level}`;
        }

        function logAction(action) {
            switch(action) {
                case 'cycle':
                    ecoCredits += 10;
                    carbonOffset += 2.5;
                    break;
                case 'reusable':
                    ecoCredits += 5;
                    plasticReduced += 0.1;
                    break;
                case 'compost':
                    ecoCredits += 15;
                    carbonOffset += 1;
                    break;
                case 'plant':
                    ecoCredits += 50;
                    treesPlanted += 1;
                    carbonOffset += 10;
                    break;
                case 'solar':
                    ecoCredits += 30;
                    carbonOffset += 5;
                    break;
                case 'meatless':
                    ecoCredits += 20;
                    carbonOffset += 3;
                    break;
            }
            updateDashboard();
            showActionFeedback(action);
            checkBadges();
        }

        function showActionFeedback(action) {
            const feedbackElement = document.createElement('div');
            feedbackElement.textContent = `Great job! You've completed a ${action.replace('_', ' ')} action.`;
            feedbackElement.classList.add('achievement', 'slide-in');
            document.body.appendChild(feedbackElement);

            setTimeout(() => {
                feedbackElement.style.opacity = '1';
                feedbackElement.classList.add('pulse');
            }, 100);

            setTimeout(() => {
                feedbackElement.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(feedbackElement);
                }, 500);
            }, 3000);
        }

        function showAchievement(message) {
            const achievementElement = document.createElement('div');
            achievementElement.textContent = message;
            achievementElement.classList.add('achievement', 'slide-in');
            document.body.appendChild(achievementElement);

            setTimeout(() => {
                achievementElement.style.opacity = '1';
                achievementElement.classList.add('pulse');
            }, 100);

            setTimeout(() => {
                achievementElement.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(achievementElement);
                }, 500);
            }, 5000);
        }

        function checkBadges() {
            if (treesPlanted >= 10 && !badges.includes('tree_hugger')) {
                awardBadge('tree_hugger');
            }
            if (plasticReduced >= 50 && !badges.includes('plastic_warrior')) {
                awardBadge('plastic_warrior');
            }
            if (carbonOffset >= 100 && !badges.includes('energy_saver')) {
                awardBadge('energy_saver');
            }
            if (level >= 10 && !badges.includes('eco_champion')) {
                awardBadge('eco_champion');
            }
        }

        function awardBadge(badgeId) {
            badges.push(badgeId);
            const badge = badgeData[badgeId];
            showAchievement(`New Badge Unlocked: ${badge.name}!`);
            updateBadges();
        }

        function updateBadges() {
            const badgeContainer = document.getElementById('badgeContainer');
            badgeContainer.innerHTML = '';
            badges.forEach(badgeId => {
                const badge = badgeData[badgeId];
                const badgeElement = document.createElement('div');
                badgeElement.className = 'badge';
                badgeElement.textContent = badge.icon;
                const tooltip = document.createElement('div');
                tooltip.className = 'badge-tooltip';
                tooltip.textContent = `${badge.name}: ${badge.description}`;
                badgeElement.appendChild(tooltip);
                badgeContainer.appendChild(badgeElement);
            });
        }

        const leaderboardData = [
            { name: "EcoWarrior", score: 5000 },
            { name: "GreenGuru", score: 4500 },
            { name: "EarthDefender", score: 4000 },
            { name: "SustainableHero", score: 3500 },
            { name: "PlanetProtector", score: 3000 }
        ];

        function updateLeaderboard() {
            const leaderboardList = document.getElementById('leaderboardList');
            leaderboardList.innerHTML = '';
            leaderboardData.forEach((user, index) => {
                const li = document.createElement('div');
                li.className = 'leaderboard-item';
                li.innerHTML = `
                    <span>${index + 1}. ${user.name}</span>
                    <span>${user.score} EcoCredits</span>
                `;
                leaderboardList.appendChild(li);
            });
        }

        function openWindow(windowType) {
            document.getElementById(`${windowType}Window`).style.display = 'block';
            if (windowType === 'snap') {
                startCamera();
            }
        }

        function closeWindow(windowType) {
            document.getElementById(`${windowType}Window`).style.display = 'none';
            if (windowType === 'snap') {
                stopCamera();
            }
        }

        let stream;

        function startCamera() {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(s) {
                    stream = s;
                    document.getElementById('camera-feed').srcObject = stream;
                })
                .catch(function(error) {
                    console.error("Error accessing the camera", error);
                });
        }

        function stopCamera() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }

        function snapPhoto() {
            const video = document.getElementById('camera-feed');
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const photo = document.getElementById('snap-photo');
            photo.src = canvas.toDataURL('image/jpeg');
            photo.style.display = 'block';
        }

        document.getElementById('challenge-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const challengeName = document.getElementById('challenge-name').value;
            const challengeDuration = document.getElementById('challenge-duration').value;
            showAchievement(`You've started the "${challengeName}" challenge for ${challengeDuration} days! Good luck!`);
            closeWindow('challenge');
        });

        document.getElementById('snap-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const action = document.getElementById('snap-action').value;
            logAction(action);
            closeWindow('snap');
        });

        function joinChallenge(challenge) {
            showNotification(`You've joined the ${challenge} challenge!`);
        }

        function registerForEvent(event) {
            showNotification(`You've registered for the ${event} event!`);
        }

        function checkAnswer(answer) {
            const correctAnswer = 'coal';
            const resultElement = document.getElementById('quizResult');
            if (answer === correctAnswer) {
                resultElement.textContent = 'Correct! Coal is not a renewable energy source.';
                resultElement.style.color = 'green';
                ecoCredits += 20;
                updateDashboard();
            } else {
                resultElement.textContent = 'Incorrect. Try again!';
                resultElement.style.color = 'red';
            }
        }

        function buyItem(item) {
            let cost;
            switch(item) {
                case 'water-bottle':
                    cost = 500;
                    break;
                case 'tote-bag':
                    cost = 300;
                    break;
                case 'solar-power-bank':
                    cost = 1000;
                    break;
            }
            if (ecoCredits >= cost) {
                ecoCredits -= cost;
                updateDashboard();
                showNotification(`You've purchased the ${item.replace('-', ' ')}!`);
            } else {
                showNotification("Not enough EcoCredits!");
            }
        }

        function challengeFriend(friend) {
            showNotification(`You've challenged ${friend} to an eco-friendly duel!`);
        }

        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }

        document.getElementById('carbon-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const electricity = parseFloat(document.getElementById('electricity').value);
            const gas = parseFloat(document.getElementById('gas').value);
            const car = parseFloat(document.getElementById('car').value);

            const carbonFootprint = (electricity * 0.4) + (gas * 5.3) + (car * 0.4);
            document.getElementById('carbon-result').textContent = `Your estimated monthly carbon footprint is ${carbonFootprint.toFixed(2)} kg CO2e.`;
        });

        // Intersection Observer for section animations
        const sections = document.querySelectorAll('section');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        function openSat(page) {
    window.location.href = page; // Navigates to the specified page
}


        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Initialize
        updateDashboard();
        updateLeaderboard();
        updateBadges();
   