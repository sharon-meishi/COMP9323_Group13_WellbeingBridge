import React from 'react'
import NavBar from '../components/NavigationBar/NavBar';
import BackToTop from '../components/BackToTop';
import OrgSearch from '../components/SearchPage/OrgSearch'
import BottomBar from '../components/Public/BottomBar'

function OrgSearchPage() {
    return (
        <>
        <BackToTop showBelow={250} />
        <NavBar search={true}/>
        <OrgSearch/>
        <BottomBar/>
      </>
    )
}

export default OrgSearchPage
