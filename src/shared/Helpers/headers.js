const composeHeader = (token = null) => {
	return {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Content-Language': 'en',
		'X-Requested-With': 'XMLHttpRequest', // for security reasons
		'Authorization': `${token}`,
	}
};

export default composeHeader;
