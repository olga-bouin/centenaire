
// models
import { getMenu } from '../../../model/menu';

// libs
import Header from '../../../components/header/header';
import Head from 'next/head';
import { useState } from 'react';
import SortableTree, { getVisibleNodeCount} from 'react-sortable-tree';
import DefaultErrorPage from 'next/error'

// parameters
import { CATEGORIES } from "../../../utils/parameters"
import { getAllPages } from '../../../model/page';
import { useRouter } from 'next/router';

const format = page => {

    return ({
        title: page.pageName,
        id: page.id,
        pageSlug: page.pageSlug,
        original_id: page.original_id
    })
}

const containerStyle = {paddingBottom: 80}
const bottomBarStyle = {height: 80}

export default function AdminCategory({pages, menu, categoryName}) {


    const {defaultLocale} = useRouter()

    // only store default language pages (only fr)
    const [treedata, setTreedata] = useState(pages ? pages.filter(p => p.language === defaultLocale).map(page => format(page)) : [])

    // listeners
    const onMoveNode = nextTreeData => setTreedata(nextTreeData)

    const onSubmit = () => {

        // form
        let form = pages.map(page => {

            // Maybe do not push into array if index not found (shoudnt happen)
            let newPosition = treedata.findIndex(t => t.original_id === page.original_id)

            return ({
                id: page.id,
                position: newPosition
            })

        })
        
        // PUT new positions
        fetch("/api/page", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
        .then(response => {
            if(response.ok){
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(body => {

            // force reload
            window.location.reload()

        })
        .catch(err => {
            console.log(err)
            alert("NOT OK")
        })
    }

    // others
    const pagesEmpty = !pages || !pages.length
    const count = getVisibleNodeCount({treeData: treedata})
    
    // render

    let pageContent = ""

    if(pagesEmpty){
        pageContent = (
            <p className="">Il n'y a pas de page dans cette catégorie.</p>
        )
    }


    else {
        
        pageContent = (
            <div style={containerStyle}>

                {/* Submit */}
                <div style={bottomBarStyle} className="border-2 z-10 fixed bottom-0 left-0 w-full bg-white flex justify-end items-center pr-5">
                    <button type="button" onClick={onSubmit} type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-3 rounded cursor-pointer">Sauvegarder le nouvel ordre</button>
                </div>


                {/* Category name */}
                <h1 className="text-4xl font-semibold capitalize mb-5">{categoryName}</h1>


                <h2 className="text-2xl">Ordre d'affichage des pages : </h2>
                {/* Tree */}
                <div style={{height: count * 62}}>
                    <SortableTree
                        onChange={onMoveNode}
                        treeData={treedata}
                        maxDepth={1}
                        generateNodeProps={({node}) => {

                            const permalien = node.pageSlug.startsWith("/") ? node.pageSlug : "/" + node.pageSlug

                            return {
                                buttons: [
                                    <a target="_blank" className="text-gray-600 underline px-4" href={permalien}>Lien vers la page</a>
                                ]
                            }
                        }}
                    />
                </div>


            </div>
        )
    }


    return (
        <>
            <Head>
                <title>Admin - Catégories - {categoryName}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {menu && <Header menu={menu.data}/>}
            <main className="max-w-screen-xl p-4 bg-white md:mx-auto">
                {pageContent}
            </main>
        </>
    );
}

export async function getServerSideProps(context) {

    const {name} = context.params;

    const menu = await getMenu(context.locale)
    const pages = await getAllPages(null, name)
      
    return {props: {
      menu: menu,
      pages,
      categoryName: name,
    }}
}
