import { AnimationProps, motion } from 'framer-motion';
import React from 'react';

interface propsType {
    children: React.ReactNode,
    aniProps?: AnimationProps
}

const PageTrasition = ({children, aniProps }: propsType) =>{ 
    return (
        <motion.div 
        initial={aniProps?.initial??{ y: '-100vh' }}
        animate={aniProps?.animate??{ y: 0 }}
        exit={aniProps?.exit??{ y: '-100vh' }}
        transition={aniProps?.transition??{ duration: 0.2 }}
        className='h-full '
        >
            {children}
        </motion.div>
    )
}

export default PageTrasition;