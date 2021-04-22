

    const Select = ({children, value, onChange, defaultValue}) => {
    

    const options = children.map(option=>{
        return (
            <option key={option.id} id={option.id}>{option.name}</option>
        )
    })


        return (
            <select className='filter-select' value={value} onChange={(e) => {
                onChange(children.find(el => {
                    if (el.name === e.target.value) {
                        return el
                    }
                }))

            }}>
                <option> {defaultValue} </option>
                {options}
            </select>
        )
    }

export default Select