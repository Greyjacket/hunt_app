import React from 'react';

function NoteEditor({ value, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return <textarea value={value} onChange={handleChange} />;
}

export default NoteEditor;
// import Embed from '@editorjs/embed'
// import Table from '@editorjs/table'
// import List from '@editorjs/list'
// import Warning from '@editorjs/warning'
// import Code from '@editorjs/code'
// import LinkTool from '@editorjs/link'
// import Image from '@editorjs/image'
// import Raw from '@editorjs/raw'
// import Header from '@editorjs/header'
// import Quote from '@editorjs/quote'
// import Marker from '@editorjs/marker'
// import CheckList from '@editorjs/checklist'
// import Delimiter from '@editorjs/delimiter'
// import InlineCode from '@editorjs/inline-code'
// import SimpleImage from '@editorjs/simple-image'

// import EditorJS from '@editorjs/editorjs'

// const EditorNoSSR = ({ type }) => {

//  const TOOLS = {
//      embed: Embed,
//      table: Table,
//      marker: Marker,
//      list: List,
//      warning: Warning,
//      code: Code,
//      linkTool: LinkTool,
//      image: Image,
//      raw: Raw,
//      header: Header,
//      quote: Quote,
//      checklist: CheckList,
//      delimiter: Delimiter,
//      inlineCode: InlineCode,
//      simpleImage: SimpleImage,
//  }

//  const NoteEditor = new EditorJS({
//      /** 
//       * Id of Element that should contain the Editor 
//       */
//      holder: 'editorjs',
//      tools: TOOLS,
//  })

//  return (<>
//      <div>
//          <div id="editorjs">
//          </div>
//      </div>
//  </>);
//  }

// // import Header from '@editorjs/header'; 
// // import List from '@editorjs/list'; 

// // const NoteEditor = new EditorJS({ 
// //   /** 
// //    * Id of Element that should contain the Editor 
// //    */ 
// //   holder: 'editorjs', 

// //   /** 
// //    * Available Tools list. 
// //    * Pass Tool's class or Settings object for each Tool you want to use 
// //    */ 
// //   tools: { 
// //     header: {
// //       class: Header, 
// //       inlineToolbar: ['link'] 
// //     }, 
// //     list: { 
// //       class: List, 
// //       inlineToolbar: true 
// //     } 
// //   }, 
// // })


// export default NoteEditor;