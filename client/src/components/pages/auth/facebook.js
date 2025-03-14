import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import axios from 'axios';

const Facebook = ({ informParent = f => f }) => {
    const responseFacebook = response => {
        console.log(response);
        axios({
            method: 'POST',
            url: `http://localhost:8000/api/facebook-login`,
            data: { userID: response.userID, accessToken: response.accessToken }
        })
            .then(response => {
                console.log('FACEBOOK SIGNIN SUCCESS', response);
                // inform parent component
                informParent(response);
            })
            .catch(error => {
                console.log('FACEBOOK SIGNIN ERROR', error.response);
            });
    };
    return (
        <div className="pb-3">
            <FacebookLogin
                appId={`154959638896320`}
                autoLoad={false}
                callback={responseFacebook}
                render={renderProps => (
                    <button onClick={renderProps.onClick} className="btn btn-primary btn-lg btn-block">
                        <i className="fab fa-facebook pr-2"></i> Login with Facebook
                    </button>
                )}
            />
        </div>
    );
};

export default Facebook;
