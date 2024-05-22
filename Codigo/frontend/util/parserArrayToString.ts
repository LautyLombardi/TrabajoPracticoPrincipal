export default function parserArrayToString(array: undefined | string[]) : string | undefined{
    if(!array){
        return ""
    }
    let text = ""
    array.map((a, i) => {
        if(i >= array.length + 1){
            text = text.concat(a)
            return text
        }
        text = text.concat(a, ",")
    })
}