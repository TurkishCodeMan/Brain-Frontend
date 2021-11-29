import { Notyf } from 'notyf'
import 'notyf/notyf.min.css';
const notyf = new Notyf({
    duration: 2000,
    position: {
        x: 'right',
        y: 'bottom',
    },
    types: [
        {
            type: 'warning',
            background: '##ffa100',
            icon: {
                className: 'fas fa-hand-paper',
                tagName: 'i',
                text: '',
            },
        },
        {
            type: 'info',
            background: '##ffa100',
            icon: {
                className: 'fas fa-info-circle',
                tagName: 'i',
                text: '',
            },
        },
        {
            type: 'primary',
            background: '##ffa100',
            icon: {
                className: 'fas fa-car-crash',
                tagName: 'i',
                text: '',
            },
        },
        {
            type: 'accent',
            background: '##ffa100',
            icon: {
                className: 'fas fa-car-crash',
                tagName: 'i',
                text: '',
            },
        },
        {
            type: 'purple',
            background:'##ffa100',
            icon: {
                className: 'fas fa-check',
                tagName: 'i',
                text: '',
            },
        },
        {
            type: 'blue',
            background: '##ffa100',
            icon: {
                className: 'fas fa-check',
                tagName: 'i',
                text: '',
            },
        },
        {
            type: 'green',
            background: '##ffa100',
            icon: {
                className: 'fas fa-check',
                tagName: 'i',
                text: '',
            },
        },
        {
            type: 'orange',
            background: '##ffa100',
            icon: {
                className: 'fas fa-check',
                tagName: 'i',
                text: '',
            },
        },
    ],
})

export default function useNotyf() {
    return {
        success: (message) => {
            notyf.success(message)
        },
        error: (message) => {
            notyf.error(message)
        },
        info: (message) => {
            notyf.open({
                type: 'info',
                message,
            })
        },
        warning: (message) => {
            notyf.open({
                type: 'warning',
                message,
            })
        },
        primary: (message) => {
            notyf.open({
                type: 'primary',
                message,
            })
        },
        purple: (message) => {
            notyf.open({
                type: 'purple',
                message,
            })
        },
        blue: (message) => {
            notyf.open({
                type: 'blue',
                message,
            })
        },
        green: (message) => {
            notyf.open({
                type: 'green',
                message,
            })
        },
        orange: (message) => {
            notyf.open({
                type: 'orange',
                message,
            })
        },
    }
}
