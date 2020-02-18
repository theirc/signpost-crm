const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink #023950',
      color: 'white',
      backgroundColor: "rgb(32, 33, 37)",
      cursor: 'pointer'
    }),
    control: (base, state) => ({
      // none of react-select's styles are passed to <Control />
      ...base,
      backgroundColor: "rgb(32, 33, 37)",
      color: 'white',
      border: "1px solid white",
      marginTop: '10px'
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
      const backgroundColor =  "rgb(32, 33, 37)";
      const color = "white";
      return { ...provided, opacity, transition, backgroundColor, color};
    },
    menuList: (provided, state) => ({
        ...provided,
        backgroundColor: "rgb(32, 33, 37)",
        color: 'white',
        border: "1px solid white"
    }),
    option: (base, state) => {
        return {
        ...base,
        backgroundColor: "rgb(26,27,31)",
        "&:hover": {
            backgroundColor: '#6F757F',}
        }
    }
  }

  export default customStyles;