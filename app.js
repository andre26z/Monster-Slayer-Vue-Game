function getrandomvalue(min, max) {
	return Math.floor(Math.random() * (12 - 5)) + 5;
}

const app = Vue.createApp({
	data() {
		return {
			monsterhealth: 100,
			playerhealth: 100,
			currentround: 0,
			winner: null,
			logmessages: [],
		};
	},
	computed: {
		playerhealthbar() {
			if (this.playerhealth < 0) {
				return { width: "0%" };
			}
			return { width: this.playerhealth + "%" };
		}, // fiz o playerhealth de forma computed e o monsterhealth de forma inline pra treinar das duas formas
		monsterhealthbar() {
			if (this.monsterhealth < 0) {
				return { width: "0%" };
			}
			return { width: this.monsterhealth + "%" };
		},
		enableespecial() {
			return this.currentround % 3 !== 0; // se o round atual for não for divisível por 3 (3, 6, 9, 12 e etc) não pode usar especial, caso o round atual seja divísivel por 3 pode usar especial
		},
	},

	methods: {
		startgame() {
			this.playerhealth = 100;
			this.monsterhealth = 100;
			this.winner = null;
			this.currentround = 0;
			this.logmessages = [];
		},
		monsteratack() {
			const atackValue = getrandomvalue(8, 16);
			this.playerhealth -= atackValue;
			this.addlogmessage("monster", "atack", atackValue);
		},
		playeratack() {
			this.currentround++;
			const atackValue = getrandomvalue(5, 12);
			this.monsterhealth -= atackValue;
			this.addlogmessage("player", "atack", atackValue);
			this.monsteratack(); // esse meu this está chamando outro método, coisa nova, além de puxar a data também podemos puxar outro método como se fosse outra função (na vdd é uma outra função)
		},
		especial() {
			this.currentround++;
			const atackValue = getrandomvalue(16, 20);
			this.monsterhealth -= atackValue;
			this.monsteratack();
		},
		heal() {
			this.currentround++;
			const heal = 12;
			this.playerhealth += heal;
			this.addlogmessage("player", "heal", heal);
			if (this.playerhealth + heal > 100) {
				this.playerhealth = 100;
			}
			this.monsteratack();
		},
		surrender() {
			this.playerhealth = 0;
		},
		addlogmessage(who, what, value) {
			this.logmessages.unshift({
				actionby: who,
				actiontype: what,
				actionvalue: value,
			});
		},
	},
	watch: {
		playerhealth(value) {
			if (value <= 0 && this.monsterhealth <= 0) {
				// draw
				this.winner = "draw";
			} else if (value <= 0) {
				// player lost
				this.winner = "monster";
			}
		},

		monsterhealth(value) {
			if (value <= 0 && this.playerhealth <= 0) {
				// monster lost
				this.winner = "draw";
			} else if (value <= 0) {
				// monster lost
				this.winner = "player";
			}
		},
	},
});

app.mount("#game");
