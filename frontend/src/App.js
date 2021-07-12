import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AppContext } from './utils/store';
import HomePage from './pages/HomePage';
import OrganizationApplyPage from './pages/OrganizationApplyPage';
import EventDetailsPage from './pages/EventDetailsPage';
import EventEditPage from './pages/EventEditPage';
import { ThemeProvider } from '@material-ui/core/styles';
import Theme from './components/theme';
import { storage } from './components/firebase';

function App() {
  const [isLoginState, setIsLoginState] = React.useState(
    sessionStorage.getItem('token') !== null
  );
  const [userType, setUserType] = React.useState(
    sessionStorage.getItem('userType')
  );

  const store = {
    isLoginState,
    setIsLoginState,
    userType,
    setUserType,
  };

  const allInputs = { imgUrl: '' };
  const [imageAsFile, setImageAsFile] = useState('');
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  console.log(imageAsFile);
  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
  };

  const handleFireBaseUpload = (e) => {
    e.preventDefault();
    console.log('start of upload');
    // async magic goes here...
    if (imageAsFile === '') {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    const uploadTask = storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);
    //initiates the firebase side uploading
    uploadTask.on(
      'state_changed',
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref('images')
          .child(imageAsFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImageAsUrl((prevObject) => ({
              ...prevObject,
              imgUrl: fireBaseUrl,
            }));
          });
      }
    );
  };

  

  return (
    <ThemeProvider theme={Theme}>
      <AppContext.Provider value={store}>
        <form onSubmit={handleFireBaseUpload}>
          <input type='file' onChange={handleImageAsFile} />
          <button>upload to firebase</button>
        </form>
        <img src={imageAsUrl.imgUrl} alt="image tag" />
        <Switch>
          <Route exact path='/home' component={HomePage} />
          <Route exact path='/:eventId' component={EventDetailsPage} />
          <Route
            exact
            path='/organization/apply'
            component={OrganizationApplyPage}
          />
          <Route
            exact
            path={['/event/create', '/event/edit/:eventId']}
            component={EventEditPage}
          />
          <Redirect to='/home' />
        </Switch>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
