// https://quilljs.com/docs/delta#delta
import Quill from 'quill';
import { useEffect } from 'react';
import "quill/dist/quill.snow.css";
import { useRef } from "react";
import "./index.scss";
import { Button } from 'antd';

const QuillEditor = ()=>{
    const quillRef = useRef<HTMLDivElement>(null);
    const quill = useRef<Quill>(null);
    const options = {
        // debug: 'info',
        modules: {
            toolbar: true,
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'
    };
    useEffect(()=>{
        quill.current = new Quill(quillRef.current, options);
        quill.current.setText('🚀');
        //  quill.insertEmbed('expression', {
        //     code: '🚀',
        //     src:'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi'
        //  });
    }, [])
    const add = ()=>{
        const { index } = quill?.current?.getSelection(true);
        quill.current.insertEmbed(index,'expression', {
            code: '🚀',
            src:'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi'
        });
        console.log('quill', index);
    }
    return (
        <>
            <div ref={quillRef} className='lx-quill' />
            <Button onClick={add}>发送</Button>
        </>
    )
};
export default QuillEditor
