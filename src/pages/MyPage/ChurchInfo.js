//rsc 단축키


import React from 'react';
import Background from 'context/Background';
import Page from 'components/styles/Page';
import BottomNav from 'layouts/BottomNav';
const ChurchInfo = () => {





    return (
        <Background type='sparkle'>
            <Page scrollable={true} className="churchInfo">
                <div>
                    교회정보 뿌릴거임!
                </div>
            </Page>
            <BottomNav/>
        </Background>
    );
}

export default ChurchInfo;