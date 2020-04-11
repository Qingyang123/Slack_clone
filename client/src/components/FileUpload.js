import React, {useEffect, useState} from 'react';
import Dropzone, {useDropzone} from 'react-dropzone';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  
  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };

const FileUpload = ({ children, disableClick, mutate, channelId }) => {
    // const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

    // const files = acceptedFiles.map(file => {
    //     console.log(file);
    //     return (
    //         <li key={file.path}>
    //           {file.path} - {file.size} bytes
    //         </li>
    //     )
    // });

    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: async ([file]) => {
          //   console.log(acceptedFiles);
          //     setFiles(acceptedFiles.map(file => Object.assign(file, {
          //     preview: URL.createObjectURL(file)
          // })));
            const response = await mutate({
                variables: {
                    channelId,
                    file
                }
            })
            console.log(response);
        }
    });  
    
    const thumbs = files.map(file => {
        console.log(file);
        return (
            <div style={thumb} key={file.name}>
                <div style={thumbInner}>
                  <img
                    src={file.preview}
                    style={img}
                  />
                </div>
            </div>
        )
    });
  
    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className="container">
          <div {...getRootProps({className: 'dropzone', onClick: e => e.stopPropagation()})}>
            <input {...getInputProps()} />
            { children }
          </div>
        </section>
    );
};


const createFileMessageMutation = gql`
    mutation($channelId: Int!, $file: Upload) {
        createMessage(channelId: $channelId, file: $file)
    }
`;


export default graphql(createFileMessageMutation)(FileUpload);