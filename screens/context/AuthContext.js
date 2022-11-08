import * as React from 'react';

export const AuthContext = React.createContext();

export const useAuthContext = () => {
    return React.useContext(AuthContext);
}
