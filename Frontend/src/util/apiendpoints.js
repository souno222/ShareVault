const BASE_URL = "http://localhost:8080/api/v1.5";

export const apiEndpoints = {
    FETCH_FILES: `${BASE_URL}/files/my`,
    FETCH_SAVED_FILES: `${BASE_URL}/saved-files`,
    ADD_TO_SAVED: (id)=> `${BASE_URL}/saved-files/add/${id}`,
    REMOVE_FROM_SAVED: (id)=> `${BASE_URL}/saved-files/remove/${id}`,
    GET_CREDITS: `${BASE_URL}/users/credits`,
    CHANGE_FILE_VISIBILITY: (id,visibility)=> `${BASE_URL}/files/${id}/visibility?visibility=${visibility}`,
    IS_FILE_SAVED: (id)=> `${BASE_URL}/saved-files/is-saved/${id}`,
    EDIT_FILE_ACCESS_LIST:(id)=> `${BASE_URL}/files/${id}/access`,
    GET_FILE_ACCESS_LIST:(id)=> `${BASE_URL}/files/${id}/access-list`,
    RENAME_FILE: (id, newName) => `${BASE_URL}/files/rename/${id}?newName=${newName}`,
    DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
    DELETE_FILE: (id) => `${BASE_URL}/files/delete/${id}`,
    UPLOAD_FILE: `${BASE_URL}/files/upload`,
    PUBLIC_FILE_VIEW: (fileId) => `${BASE_URL}/files/view/${fileId}`,
}