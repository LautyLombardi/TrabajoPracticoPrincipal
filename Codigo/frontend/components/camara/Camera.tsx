import { CameraProps, CameraView } from "expo-camera"
import React, { LegacyRef, useRef } from "react"
import { StyleProps } from "react-native-reanimated"

interface PropCamera extends CameraProps {
    children?: React.ReactNode,
    style?: StyleProps,
    camRef: any
}

const Camera : React.FC<PropCamera> = (props: PropCamera): JSX.Element => {

    return (
        <CameraView style={props.style} facing="front" ref={props.camRef}>
            {props.children}
        </CameraView>
    )
}

export default Camera;
