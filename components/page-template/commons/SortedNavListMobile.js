//utils
import React, { Component } from "react"
import { getPagesSortedByPosition } from "../../../utils/utils"



function SortedNavListMobile({ list, category}) {

    // methods
    const onSelectLangue = event => {
        // value
        let pageName = event.target.value
        const found = list.find(element => element.pageName === pageName);
        let url = new URL(window.location)
        let originWithNewUrl = url.origin + "/" + found.pageSlug
        let newUrl = originWithNewUrl

        // change page
        window.location = newUrl

    }


    return (
        <div className="mb-8 mr-5">
            <h4 className="mb-2 font-medium">Listes des autres pages <em>{category}</em></h4>
            <select className="border px-2 py-3 rounded" onChange={onSelectLangue} >
                {
                    getPagesSortedByPosition(list).map(page => (
                        <option key={page.pageSlug} value={page.pageName}>
                            {page.pageName}
                        </option>
                    ))
                }
            </select>
        </div>
    );


}

export default SortedNavListMobile;

