let size , nodes , cols , rows , canvas , c , frame_per_second , speed 
let neighbors_node , visited_neighbors_node , current_neighbor_node , myReqDraw 
const prims_maze = props => {
    size = props.size
    nodes = props.nodes 
    cols = props.cols 
    rows = props.rows 
    canvas = props.canvas 
    c = props.c 

    frame_per_second = props.frame_per_second
    speed = props.speed

    neighbors_node = []
    visited_neighbors_node = []
    current_neighbor_node = null 
    
    clearInterval(myReqDraw)
    setup_prims_maze(nodes , cols , rows)
}

const setup_prims_maze = (nodes_array , w , h) => {
    let midd_x =  Math.floor(w / 2) * size + (size / 2)
    let midd_y =  Math.floor(h / 2) * size + (size / 2)
    let center_node = nodes_array.find(node => node.x === midd_x && node.y === midd_y)
    neighbors_node.push(center_node)
    visited_neighbors_node.push(center_node)
    current_neighbor_node = center_node

    draw_prims_maze()
}

const draw_prims_maze = () => {
    myReqDraw = setTimeout(() => {
        draw_prims_maze()
    }, frame_per_second / speed)
    c.clearRect(0,0,canvas.width, canvas.height)

    for(let i = 0; i < nodes.length; i ++){
        nodes[i].draw()
    }

    if(neighbors_node.length === 0){
        clearInterval(myReqDraw)
    }

    add_neighbor_node()
}

const add_neighbor_node = () => {
    let {x , y} = current_neighbor_node
    
    let {top , right , bottom , left} = get_top_right_bottom_left(current_neighbor_node , nodes) 

    if(
        top 
        && !visited_neighbors_node.find(node => node.x === x && node.y === y - size)
        && !neighbors_node.find(node => node.x === x && node.y === y - size)
    ){
        neighbors_node.push(top)
        top.prev_node = current_neighbor_node
    }

    if(
        right 
        && !visited_neighbors_node.find(node => node.x === x + size && node.y === y)
        && !neighbors_node.find(node => node.x === x + size && node.y === y)
    ){
        neighbors_node.push(right)
        right.prev_node = current_neighbor_node
    }

    if(
        bottom 
        && !visited_neighbors_node.find(node => node.x === x && node.y === y + size)
        && !neighbors_node.find(node => node.x === x && node.y === y + size)
    ){
        neighbors_node.push(bottom)
        bottom.prev_node = current_neighbor_node
    }

    if(
        left 
        && !visited_neighbors_node.find(node => node.x === x - size && node.y === y)
        && !neighbors_node.find(node => node.x === x - size && node.y === y)
    ){
        neighbors_node.push(left)
        left.prev_node = current_neighbor_node
    }

    neighbors_node = neighbors_node.filter(node => node.x === x && node.y === y ? false : true )

    link_node_with_random_neighbor()
}

const link_node_with_random_neighbor = () => {
    if(neighbors_node.length === 0) return
    let random_num = getRandom(0 , neighbors_node.length)
    let random_neighbor = neighbors_node[random_num]
    let {top , right , bottom , left} = get_top_right_bottom_left(random_neighbor,visited_neighbors_node)

    if(top && top.x === random_neighbor.prev_node.x && top.y === random_neighbor.prev_node.y){
        random_neighbor.walls[0] = false 
        top.walls[2] = false
    }

    if(right && right.x === random_neighbor.prev_node.x && right.y === random_neighbor.prev_node.y){
        random_neighbor.walls[1] = false 
        right.walls[3] = false
    }

    if(bottom && bottom.x === random_neighbor.prev_node.x && bottom.y === random_neighbor.prev_node.y){
        random_neighbor.walls[2] = false 
        bottom.walls[0] = false
    }

    if(left && left.x === random_neighbor.prev_node.x && left.y === random_neighbor.prev_node.y){
        random_neighbor.walls[3] = false 
        left.walls[1] = false
    }

    current_neighbor_node = random_neighbor
    visited_neighbors_node.push(random_neighbor)
}

const get_top_right_bottom_left = (node , array ) => {
    let {x , y} = node
    let top = array.find(n => n.x === x && n.y === y - size)
    let right = array.find(n => n.x === x + size && n.y === y)
    let bottom = array.find(n => n.x === x && n.y === y + size)
    let left = array.find(n => n.x === x - size && n.y === y)

    return {top , right , bottom , left }
}

const getRandom = (min,max) => {
    return Math.floor(Math.random() * (max - min) + min)
}

export {prims_maze}

