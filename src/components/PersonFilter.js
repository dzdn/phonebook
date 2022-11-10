import React from "react"

const PersonFilter = ({ filter, handleFilterChange }) => {
    return (
        <div>
            filter shown with <input value={filter} onChange={handleFilterChange} />
        </div>
    )
}

export default PersonFilter