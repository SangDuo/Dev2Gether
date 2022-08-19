/**
 *
 *            888                                               .d8888b.   .d8888b.
 *          888                                               d88P  Y88b d88P  Y88b
 *         888                                                     .d88P 888
 *     .d88888  .d88b.  888  888        888  888 .d8888b         8888"  888d888b.
 *   d88" 888 d8P  Y8b 888  888       888  888 88K               "Y8b. 888P "Y88b
 *  888  888 88888888 Y88  88P      888  888 "Y8888b.      888    888 888    888
 *  Y88b 888 Y8b.      Y8bd8P       Y88b 888      X88      Y88b  d88P Y88b  d88P
 *  "Y88888  "Y8888    Y88P         "Y88888  88888P'       "Y8888P"   "Y8888P"
 *                                     888
 *                               Y8b d88P
 *                                "Y88P"
 *
 * @author dev-ys-36
 * @link https://github.com/dev-ys-36
 * @license MIT LICENSE
 *
 * The copyright indication and this authorization indication shall be
 * recorded in all copies or in important parts of the Software.
 *
 */

const session_pwd = 'ZGV2MmdldGhlcg=='
const mysql_pwd = 'U2FuZ3lvb25zMTIzNCFAIw=='

const session_data = () => {
	const data = Buffer.from(session_pwd, 'base64').toString('utf8')
	return data
}

const mysql_data = (dbName) => {
	const data = {
		host: '127.0.0.1',
		port: 3306,
		user: 'root',
		password: Buffer.from(mysql_pwd, 'base64').toString('utf8'),
		database: dbName,
		dateStrings: 'date'
	}
	return data
}

module.exports.session_data = session_data
module.exports.mysql_data = mysql_data
