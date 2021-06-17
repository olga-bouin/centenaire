import { query } from '../lib/db'

export async function getMenu(locale = ""){
    
    let menuRow = null

    if(locale){

        // fetch
        const menu = await query(`
            SELECT * FROM pagecontent
            WHERE page = ? AND language = ?
            ORDER BY blockid
        `,["menu", locale])

        menuRow = menu && menu[0]
    }

    return menuRow ? {
        data: JSON.parse(menuRow.blockcontent),
        id: menuRow.id,
        locale: menuRow.language
    } : null
}

export async function getMenus(locales = []){
        
    // promises
    let promisesGettingAllMenus = locales.map(locale => getMenu(locale))

    // fetch all
    let menus = await Promise.all(promisesGettingAllMenus)

    // only get valid menu
    menus = menus.filter(menu => !!menu)

    return menus
}

// export async function setMenu(menuData, menuLocale){
    
//     const menu = await query(`
//         SELECT * FROM pagecontent
//         WHERE page = ? AND language = ?
//         ORDER BY blockid
//     `,["menu", menuLocale])

//     const menuData = menu && menu[0] && JSON.parse(menu[0].blockcontent)

//     return menuData
// }