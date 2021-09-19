require("dotenv/config")

const { Client, Intents } = require("discord.js")

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
})

const prefix = "&"

const { Player } = require("discord-music-player")
const player = new Player(client, {
	leaveOnEmpty: false,
})
client.player = player

const { RepeatMode } = require("discord-music-player")

client.on("ready", () => {
	console.log("I am ready to Play with DMP 🎶")
})

client.on("messageCreate", async (message) => {
	const args = message.content.slice(prefix.length).trim().split(/ +/g)
	const command = args.shift()
	let guildQueue = client.player.getQueue(message.guild.id)

	if (command === "play") {
		let queue = client.player.createQueue(message.guild.id)
		await queue.join(message.member.voice.channel)
		let song = await queue.play(args.join(" ")).catch((_) => {
			if (!guildQueue) queue.stop()
		})
		message.reply(`Now playing ${song.name}`)
	}

	if (command === "playlist") {
		let queue = client.player.createQueue(message.guild.id)
		await queue.join(message.member.voice.channel)
		let song = await queue.playlist(args.join(" ")).catch((_) => {
			if (!guildQueue) queue.stop()
		})
	}

	if (command === "skip") {
		try {
			guildQueue.skip()
		} catch (error) {
			message.reply("Nothing to skip")
		}
	}

	if (command === "stop") {
		try {
			guildQueue.stop()
			message.reply(`You gotta use the play command and give me the YT link again.`)
		} catch (error) {
			message.reply("Nothing to stop")
		}
	}

	if (command === "nowPlaying") {
		try {
			console.log(`Now playing: ${guildQueue.nowPlaying}`)
			message.reply(`Now playing: ${guildQueue.nowPlaying}`)
		} catch (error) {
			message.reply("No song is playing right now.")
		}
	}

	if (command === "pause") {
		guildQueue.setPaused(true)
		message.reply(
			`Your song ${song.name} is now paused. Use the resume command to resume playback :)`,
		)
	}

	if (command === "resume") {
		guildQueue.setPaused(false)
		message.reply(`Your song ${song.name} is back! Enjoy :)`)
	}

	if (command === "clearQueue") {
		try {
			guildQueue.clearQueue()
			message.reply("Your queue is now clear :)")
		} catch (error) {
			message.reply("Queue is already clear :)")
		}
	}

	if (command === "removeLoop") {
		guildQueue.setRepeatMode(RepeatMode.DISABLED) // or 0 instead of RepeatMode.DISABLED
	}

	if (command === "toggleLoop") {
		guildQueue.setRepeatMode(RepeatMode.SONG) // or 1 instead of RepeatMode.SONG
	}

	if (command === "toggleQueueLoop") {
		guildQueue.setRepeatMode(RepeatMode.QUEUE) // or 2 instead of RepeatMode.QUEUE
	}

	if (command === "setVolume") {
		guildQueue.setVolume(parseInt(args[0]))
	}

	if (command === "seek") {
		guildQueue.seek(parseInt(args[0]) * 1000)
	}

	if (command === "shuffle") {
		guildQueue.shuffle()
	}

	if (command === "getQueue") {
		console.log(guildQueue)
	}

	if (command === "getVolume") {
		console.log(guildQueue.volume)
	}

	if (command === "remove") {
		guildQueue.remove(parseInt(args[0]))
	}

	if (command === "createProgressBar") {
		try {
			const ProgressBar = guildQueue.createProgressBar()
			console.log(ProgressBar.prettier)
			message.reply(ProgressBar.prettier)
		} catch (error) {
			message.reply("Nothing is playing right now. Can't make a progress bar")
		}
	}
})

client.login(process.env.TOKEN)
