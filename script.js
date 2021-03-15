$(document).ready(() => {
    $("select[name='quan0']").attr('id', '0').change(() => {update(0)})
    $("select[name='quan1']").attr('id', '1').change(() => {update(1)})
    $("select[name='quan2']").attr('id', '2').change(() => {update(2)})
    $("select[name='quan3']").attr('id', '3').change(() => {update(3)})
    $("select[name='quan4']").attr('id', '4').change(() => {update(4)})
    $("input[name='street']").parent().attr('style', 'display: none;')
    $("input[name='city']").parent().attr('style', 'display: none;')
    $("input[type='radio']").change(() => {
        toggleDisplay()
    })
    $("input[type='button']").click(() => {
        validate()
    })
})
function validate() {
    let submit = true;
    let delivery = false;
    $(".error").remove()
    let lname = $("input[name='lname']")
    let phone = $("input[name='phone']")
    let phoneRE = new RegExp("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$");
    let street = $("input[name='street']")
    let city = $("input[name='city']")
    let qtys = []
    for (let i = 0; i < 5; i++) {
        let idstr = "#" + i
        qtys.push(parseInt($(idstr +" option:selected").text()));
    }
    if (qtys.reduce((a, c) => a + c) <= 0) {
        $("<strong class='error' style='color: #f00';>Please order at least 1 item</strong>").insertBefore("table");
        submit = false;
    }
    if (lname.val() === "") {
        lname.parent().append("<strong class='error' style='color: #f00';>&nbsp; Last name is a required field</strong>");
        submit = false;
    }
    if (!phoneRE.test(phone.val())) {
        phone.parent().append("<strong class='error' style='color: #f00';>&nbsp; Please enter a valid phone number</strong>");
        submit = false;
    }
    if ($("input[type='radio']:checked").val() === "delivery") {
        delivery = true;
        if (street.val() === "") {
            street.parent().append("<strong class='error' style='color: #f00';>&nbsp; Please enter your address</strong>");
            submit = false;
        }
        if (city.val() === "") {
            city.parent().append("<strong class='error' style='color: #f00';>&nbsp; Please enter your city</strong>");
            submit = false;
        }   
    }
    if (submit) {
        submitOrder(qtys, delivery)
    }
}
function submitOrder(qtys, delivery) {
    let offset = delivery? 30 : 15;
    let dtime = new Date(Date.now() + offset*60000);
    let htmlStr = `<h1>Thank you for your order!</h1>
                   <h2>It will be ready at ${dtime.toLocaleString()}</h2>`
    for (let i = 0; i < 5; i++) {
        htmlStr += `<p>${menuItems[i].name}: ${qtys[i]}</p>`
    }
    htmlStr += `<h3>Total price: $${$("#total").val()}</h3>`

    let order = window.open("");
    order.document.write(htmlStr);
}
function toggleDisplay() {
    let inputS = $("input[name='street']").parent()
    let inputC = $("input[name='city']").parent()
    if ($("input[type='radio']:checked").val() === "pickup") {
        inputS.attr('style', 'display: none;')
        inputC.attr('style', 'display: none;')
    } else {
        inputS.attr('style', 'display: block;')
        inputC.attr('style', 'display: block;')
    }
}
function update(foodIdx) {
    let idstr = "#" + foodIdx.toString()
    let row = $(idstr).parent();
    let item = menuItems[foodIdx]
    let qty = parseInt($(idstr +" option:selected").text());
    let cost = qty * item.cost
    let costBox = row.parent().find("input").val(cost.toFixed(2))
    updateTotals();
}
function updateTotals () {
    subtotal = 0;
    for (let i = 0; i < 5; i++) {
        let idstr = "#" + i
        let row = $(idstr).parent();
        let cost = parseFloat(row.parent().find("input").val())
        if (!isNaN(cost)) {
            subtotal += cost
        }
    }
    $("#subtotal").val(subtotal.toFixed(2))
    $("#tax").val((subtotal * .0625).toFixed(2))
    $("#total").val((subtotal * 1.0625).toFixed(2))
}