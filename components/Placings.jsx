import PropTypes from 'prop-types'
import { DOMParser } from 'xmldom'
import styles from '../styles/Home.module.css'

const getPlacings = html => new DOMParser()
	.parseFromString(html, 'text/html')
	.getElementsByTagName('pre')
	.item(0)
	.lastChild
	.data
	.split('\n')
	.map(s => s.trim())
	.filter(s => /\d.*/.test(s))
	.filter(s => !s.startsWith('-'))
	.flatMap(s => s.split(/\s+/).filter((t, i) => i % 3 === 2))
	.map(s => parseInt(s))

export default function Placings({ html }) {
	const placings = getPlacings(html)
	return (
		<div className={styles.description}>
			<p>
                My average placing: {placings.reduce((a, b) => a + b) / placings.length}
			</p>
			<p>
                My highest placing: {placings.reduce((a, b) => Math.min(a,b))}
			</p>
			<p>
                My lowest placing: {placings.reduce((a, b) => Math.max(a,b))}
			</p>
		</div>
	)
}

Placings.propTypes = {
	html: PropTypes.string.isRequired,
}