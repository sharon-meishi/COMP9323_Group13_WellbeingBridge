import React from 'react'
import NavBar from '../components/NavigationBar/NavBar';
import BackToTop from '../components/BackToTop';
import OrgSearch from '../components/SearchPage/OrgSearch'

function OrgSearchPage() {
    return (
        <>
        <BackToTop showBelow={250} />
        <NavBar search={true}/>
        <OrgSearch/>
      </>
    )
}

export default OrgSearchPage
