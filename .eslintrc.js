module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended'
	],
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 12,
		'sourceType': 'module'
	},
	'plugins': [
		'react'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'react/react-in-jsx-scope': 'off',
		'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }], //should add ".ts" if typescript project
	},
	'settings': {
		'react': {
			'createClass': 'createReactClass',
			'pragma': 'React',
			'fragment': 'Fragment',
			'version': 'latest',
			'flowVersion': '0.53'
		},
		'propWrapperFunctions': [
			'forbidExtraProps',
			{'property': 'freeze', 'object': 'Object'},
			{'property': 'myFavoriteWrapper'}
		],
		'linkComponents': [
			'Hyperlink',
			{'name': 'Link', 'linkAttribute': 'to'}
		]
	}
}
