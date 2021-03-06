import { Block } from '../helper_method'
import {get_top_right_bottom_left} from './helper_method/algorithms_helper_method'

let start_node , end_node , nodes , default_nodes , c , canvas , size , speed 

let open_list , close_list , current_node , myReq

const a_star = props => {
    start_node   = props.start_node 
    end_node = props.end_node 
    nodes = props.nodes
    default_nodes = props.default_nodes
    c = props.c 
    canvas = props.canvas 
    size = props.size 
    speed = props.speed

    end_node.prev_node = null

    open_list = new Map([
        [`${start_node.x} , ${start_node.y}` , start_node]
    ])
    close_list = new Map()
    current_node = null

    clearTimeout(myReq)
    run_solve_maze()
}

const stop_a_star = () => {
    clearTimeout(myReq)
}

const run_solve_maze = () => {
    myReq = setTimeout(() => {
        run_solve_maze()
    }, speed);
    c.clearRect(0,0,canvas.width, canvas.height)

    for(let node of default_nodes.values()) {
        node.draw('silver')
    }

    for(let node of nodes.values()){
        node.draw()
    }

    for(let node of close_list.values()){
        if(!end_node.prev_node){
            node.color = 'MediumBlue'
        }
        node.draw()
    }

    for(let node of open_list.values()){
        node.color = 'LightSkyBlue'
        node.draw()
    }

    if(current_node && end_node.x === current_node.x && end_node.y === current_node.y){
        end_node.prev_node = current_node.prev_node
    }

    if(open_list.size > 0 && !end_node.prev_node){
        let remove_key = null
        for(let [key , node] of open_list){
            if(remove_key === null || node.f < current_node.f) {
                remove_key = key 
                current_node = node
            }
        }
        open_list.delete(remove_key)

        close_list.set(`${current_node.x} , ${current_node.y}` , current_node)
        find_child_node()
    }

    if(end_node.prev_node && current_node){
        current_node.color = "SpringGreen"
        current_node.draw()
        current_node = current_node.prev_node
    }

    if(current_node === null){
        clearTimeout(myReq)
    }
}

const find_child_node = () => {

    let {top , right , bottom , left} = get_top_right_bottom_left(current_node , nodes , size)

    // top (x , y - size)
    add_node(top , 2)

    // right (x + size , y)
    add_node(right , 3)

    // bottom (x , y + size)
    add_node(bottom , 0)

    // left (x - size , y )
    add_node(left , 1)
}

const add_node = (neighbor_node , wall_num) => {
    if(
        neighbor_node 
        && !neighbor_node.walls[wall_num] 
        &&  !close_list.has(`${neighbor_node.x} , ${neighbor_node.y}`)
    ){
        let {x , y} = neighbor_node
        let node_in_open = open_list.get(`${x} , ${y}`)
        let n_g = current_node.g + size

        if(node_in_open){
            if(node_in_open.g > n_g) update_node(node_in_open, n_g , current_node ) 
        }else{
            let new_node = set_node(neighbor_node, n_g)
            open_list.set(`${new_node.x} , ${new_node.y}` , new_node)
        }
    }
}

const set_node = (node, g) => {
    let color = 'MediumBlue'
    let [x_1 , y_1] = [node.x , node.y] 
    let [x_2 , y_2] = [end_node.x , end_node.y] 
    let h = Math.abs(x_1 - x_2) + Math.abs(y_1 - y_2)
    let f = h + g 
    let new_node = new Block(x_1 , y_1 , c , size , color , current_node , g , h , f)
    return new_node 
}

const update_node = (node , g , parent) => {
    node.g = g 
    node.f = g + node.h 
    node.parent = parent 
}

export {a_star , stop_a_star}