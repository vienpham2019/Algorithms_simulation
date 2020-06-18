import { Block } from '../helper_method'

let start_node , end_node , nodes , c , canvas , size 

let open_list , close_list , current_node , myReq , finish_path

const dijkstra = props => {
    start_node = props.start_node
    start_node.distance = 0
    end_node = props.end_node 
    nodes = props.nodes
    c = props.c 
    canvas = props.canvas 
    size = props.size 

    end_node.prev_node = null
    
    open_list = [start_node]
    close_list = []
    current_node = null 
    finish_path = false 

    cancelAnimationFrame(myReq)
    run_solve_maze()
}

const stop_dijkstra = () => {
    cancelAnimationFrame(myReq)
}

const run_solve_maze = () => {
    myReq = requestAnimationFrame(run_solve_maze)
    c.clearRect(0,0,canvas.width, canvas.height)

    for(let i = 0 ; i < nodes.length ; i ++){
        nodes[i].draw()
    }

    for(let i = 0 ; i < close_list.length ; i ++){
        if(!end_node.prev_node){
            close_list[i].color = 'MidnightBlue'
        }
        close_list[i].draw()
    }

    for(let i = 0 ; i < open_list.length ; i ++){
        open_list[i].color = 'DeepSkyBlue'
        open_list[i].draw()
    }

    if(current_node && end_node.x === current_node.x && end_node.y === current_node.y){
        end_node.prev_node = current_node.prev_node
    }

    if(open_list.length > 0 && !end_node.prev_node){
        current_node = open_list.sort((a,b) => a.distance - b.distance)[0] 
        close_list.push(current_node)
        find_child_node()
    }

    if(end_node.prev_node){
        start_node.draw()
        end_node.draw()
        find_path() 
    }
    if(finish_path){
        cancelAnimationFrame(myReq)
    }
}

const find_child_node = () => {

    let {top , right , bottom , left} = get_top_right_bottom_left(current_node , nodes )

    // Right (x + size , y)
    if(right && !right.walls[3] && !close_list.find(node => node.x === right.x  && node.y === right.y)){
        let right_in_open = open_list.find(n => n.x === right.x  && n.y === right.y)

        right_in_open ? update_node(right_in_open) : open_list.push(create_new_node(right))
    }

    // top (x , y - size)
    if(top && !top.walls[2] && !close_list.find(node => node.x === top.x && node.y === top.y)){
        let top_in_open = open_list.find(n => n.x === top.x  && n.y === top.y)

        top_in_open ? update_node(top_in_open) : open_list.push(create_new_node(top))
    }

    // left (x - size , y )
    if(left && !left.walls[1] && !close_list.find(node => node.x === left.x && node.y === left.y)){
        let left_in_open = open_list.find(n => n.x === left.x  && n.y === left.y)
        
        left_in_open ? update_node(left_in_open) : open_list.push(create_new_node(left))
    }

    // bottom (x , y + size)
    if(bottom && !bottom.walls[0] &&!close_list.find(node => node.x === bottom.x && node.y === bottom.y)){
        let bottom_in_open = open_list.find(n => n.x === bottom.x  && n.y === bottom.y)
        
        bottom_in_open ? update_node(bottom_in_open) : open_list.push(create_new_node(bottom))
    }

    open_list = open_list.filter(node => node.x === current_node.x && node.y === current_node.y ? false : true )
}

const find_path = () => {
    current_node.color = "LimeGreen"
    if(current_node.x === start_node.x && current_node.y === start_node.y){
        finish_path = true
        return
    }
    current_node = current_node.prev_node
    return 
}

const create_new_node = (node) => {
    let distance = find_distance(node)
    return new Block(node.x , node.y , c , size , 'MidnightBlue' , current_node , null , null , null , distance)
}

const find_distance = (node) => {
    // find distance from current node to next node 
    let x_1 = current_node.x 
    let y_1 = current_node.y 

    let x_2 = node.x 
    let y_2 = node.y

   return ((Math.abs(x_1 - x_2) + Math.abs(y_1 - y_2)) * size ) + current_node.distance
}

const update_node = node => {
    if(current_node.distance + size < node.distance){
        node.distance = find_distance(node)
    }
}

const get_top_right_bottom_left = (node , array ) => {
    let {x , y} = node
    let top = array.find(n => n.x === x && n.y === y - size)
    let right = array.find(n => n.x === x + size && n.y === y)
    let bottom = array.find(n => n.x === x && n.y === y + size)
    let left = array.find(n => n.x === x - size && n.y === y)

    return {top , right , bottom , left }
}

export {dijkstra , stop_dijkstra}