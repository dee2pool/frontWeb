define(function () {
    var table = {};

    table.build = ['                                <h4>要素详情</h4>',
        '                                <table class="table table-bordered">',
        '                                    <thead>',
        '                                    <tr>',
        '                                        <th></th>',
        '                                        <th>要素名称</th>',
        '                                        <th>是否已关联</th>',
        '                                        <th>是否为建筑</th>',
        '                                        <th>操作</th>',
        '                                    </tr>',
        '                                    </thead>',
        '                                    <tbody>',
        '                                    <tr>',
        '                                        <th scope="row">1</th>',
        '                                        <td>建筑1</td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default btn1">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">2</th>',
        '                                        <td>建筑2</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">3</th>',
        '                                        <td>建筑3</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">4</th>',
        '                                        <td>建筑4</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">5</th>',
        '                                        <td>建筑5</td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default btn2">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">6</th>',
        '                                        <td>建筑6</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">7</th>',
        '                                        <td>建筑7</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">8</th>',
        '                                        <td>建筑8</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    </tbody>',
        '                                </table>',
        '                                <nav aria-label="Page navigation">',
        '                                    <ul class="pagination">',
        '                                        <li>',
        '                                            <a href="#" aria-label="Previous">',
        '                                                <span aria-hidden="true">&laquo;</span>',
        '                                            </a>',
        '                                        </li>',
        '                                        <li><a href="#">1</a></li>',
        '                                        <li><a href="#">2</a></li>',
        '                                        <li><a href="#">3</a></li>',
        '                                        <li><a href="#">4</a></li>',
        '                                        <li><a href="#">5</a></li>',
        '                                        <li>',
        '                                            <a href="#" aria-label="Next">',
        '                                                <span aria-hidden="true">&raquo;</span>',
        '                                            </a>',
        '                                        </li>',
        '                                    </ul>',
        '                                </nav>'].join("");


    table.device = ['<h4>要素详情</h4>',
        '                                <table class="table table-bordered">',
        '                                    <thead>',
        '                                    <tr>',
        '                                        <th></th>',
        '                                        <th>要素名称</th>',
        '                                        <th>是否已关联</th>',
        '                                        <th>是否为设备</th>',
        '                                        <th>操作</th>',
        '                                    </tr>',
        '                                    </thead>',
        '                                    <tbody>',
        '                                    <tr>',
        '                                        <th scope="row">1</th>',
        '                                        <td>设备1</td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default btn1">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">2</th>',
        '                                        <td>设备2</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">3</th>',
        '                                        <td>设备3</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">4</th>',
        '                                        <td>设备4</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">5</th>',
        '                                        <td>设备5</td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default btn2">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">6</th>',
        '                                        <td>设备6</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">7</th>',
        '                                        <td>设备7</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">8</th>',
        '                                        <td>设备8</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    </tbody>',
        '                                </table>',
        '                                <nav aria-label="Page navigation">',
        '                                    <ul class="pagination">',
        '                                        <li>',
        '                                            <a href="#" aria-label="Previous">',
        '                                                <span aria-hidden="true">&laquo;</span>',
        '                                            </a>',
        '                                        </li>',
        '                                        <li><a href="#">1</a></li>',
        '                                        <li><a href="#">2</a></li>',
        '                                        <li><a href="#">3</a></li>',
        '                                        <li><a href="#">4</a></li>',
        '                                        <li><a href="#">5</a></li>',
        '                                        <li>',
        '                                            <a href="#" aria-label="Next">',
        '                                                <span aria-hidden="true">&raquo;</span>',
        '                                            </a>',
        '                                        </li>',
        '                                    </ul>',
        '                                </nav>'].join("");

    table.other = ['<h4>要素详情</h4>',
        '                                <table class="table table-bordered">',
        '                                    <thead>',
        '                                    <tr>',
        '                                        <th></th>',
        '                                        <th>要素名称</th>',
        '                                        <th>是否已关联</th>',
        '                                        <th>是否为设备</th>',
        '                                        <th>操作</th>',
        '                                    </tr>',
        '                                    </thead>',
        '                                    <tbody>',
        '                                    <tr>',
        '                                        <th scope="row">1</th>',
        '                                        <td>其他1</td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default btn1">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">2</th>',
        '                                        <td>其他2</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">3</th>',
        '                                        <td>其他3</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">4</th>',
        '                                        <td>其他4</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">5</th>',
        '                                        <td>其他5</td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td><span class="red">是</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default btn2">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">6</th>',
        '                                        <td>其他6</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">7</th>',
        '                                        <td>其他7</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    <tr>',
        '                                        <th scope="row">8</th>',
        '                                        <td>其他8</td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td><span class="black">否</span></td>',
        '                                        <td>',
        '                                            <div class="btn-group btn-group-xs" role="group" aria-label="...">',
        '                                                <button type="button" class="btn btn-default ">关联</button>',
        '                                                <button type="button" class="btn btn-default">查看</button>',
        '                                            </div>',
        '                                        </td>',
        '                                    </tr>',
        '                                    </tbody>',
        '                                </table>',
        '                                <nav aria-label="Page navigation">',
        '                                    <ul class="pagination">',
        '                                        <li>',
        '                                            <a href="#" aria-label="Previous">',
        '                                                <span aria-hidden="true">&laquo;</span>',
        '                                            </a>',
        '                                        </li>',
        '                                        <li><a href="#">1</a></li>',
        '                                        <li><a href="#">2</a></li>',
        '                                        <li><a href="#">3</a></li>',
        '                                        <li><a href="#">4</a></li>',
        '                                        <li><a href="#">5</a></li>',
        '                                        <li>',
        '                                            <a href="#" aria-label="Next">',
        '                                                <span aria-hidden="true">&raquo;</span>',
        '                                            </a>',
        '                                        </li>',
        '                                    </ul>',
        '                                </nav>'].join("");





    return table;
});