// *** Important values declaration ***
let transactions_array = [];
let biggest_transaction = 'brak transakcji';
let sum_of_transactions = 'brak transakcji';


// *** Creating website elements ***
$Title = $("<h1>Aplikacja przetwarzająca transakcje walutowe</h1>")

// field to set exchange rate
$Exchange_rate_field =  $("<h2>Przelicznik walut </h2> <form id='exchange_rate_field'><input type='number' value='1' disabled> EURO = </input> <input id='exhange_rate' type='number' value='3.6' min='0' step='0.01'> ZLOTYCH </input></form>");

// building view of transactions and actions to manage them (add and delete)
Delete_transaction = "<button class='delete_button'> Usun </button>";
$Transaction_add =  $("<br><form id='transaction_add'><b>Dodaj transakcję: </b> <br><input id='transaction_name' type='text' value='nazwa transakcji'> </input> <input type='number' id='transaction_value' min='0' value='0' step='0.01'>euro </input><input id='commit_transaction' type='button' value='dodaj'></input></form>");
$Transactions_field =$( "<div id='transaction_list'> <br><h2>Lista transakcji </h2> <table></table></div><br>" );
$Transactions_table_headers = $("<tr><th>Nazwa transakcji</th><th>Kwota w euro</th><th>Kwota w złotówkach</th>");
$Transactions_field.append($Transaction_add);
$Transactions_list = $Transactions_field.children("div table");
$Transactions_list.append($Transactions_table_headers)

// building field with transaction summary
$Transactions_summary_header = $("<h2>Podsumowanie transakcji</h2>")
$Biggest_transaction = $("<div id='biggest_transaction'><b>Największa transakcja: </b></div>");
$Biggest_transaction.append($("<p>" + biggest_transaction + "</p>"));
$Sum_of_transactions = $("<div id='sum_of_transactions'><b>Suma transakcji: </b></div>");
$Sum_of_transactions.append($("<p>" + sum_of_transactions + "</p>"));
$Transactions_summary_field= $("<div id='summary'></div>");
$Transactions_summary_field.append($Transactions_summary_header);
$Transactions_summary_field.append($Biggest_transaction);
$Transactions_summary_field.append($Sum_of_transactions);

// *** A function which round value to the decimal place and calculate the absolute value. ***
function format_currency_value(value)
{
  zloty = Math.abs(Math.round(value * 100)/100);
  return zloty;

}

// *** Class Transaction ***
class Transaction
  { 
    constructor(name, value, exhange_rate)
    { 
      this.name = name;
      this.euro = format_currency_value(value);
      this.zloty = format_currency_value(this.euro * exhange_rate);
      this.element = $("<tr class='transaction'>" + "<td>" + this.name  + "</td> <td class='euro'>" + this.euro + "</td><td class='zl'>" + this.zloty + "</td><td class='delete'>" + Delete_transaction + "</td></tr>");
      var self = this;     
// bind event to remove button
      this.element.find(".delete_button").bind('click', function()
            {
              self.remove_transaction();
            }
        );

    }
  
  // adding transaction to the list and array
    add_transaction(Transactions)
    { 
      Transactions.append(this.element);
      transactions_array.push(this);
      update_transaction_summary();
      console.log(transactions_array);
      
    }

  //removing transaction from the array and list
  remove_transaction()
    {
      
      
      this.element.remove();
      transactions_array.splice($.inArray(this, transactions_array), 1);
      update_transaction_summary();
      
    }

    //update value in zlotys
    update_zl(exhange_rate)
    {
     this.zloty = format_currency_value(this.euro * exhange_rate)
     this.element.children(".zl").text(this.zloty);

    }
    
 }


 // *** Function to create new transaction ***

function create_transaction()
{
  name = $("#transaction_name").val();
  value = $("#transaction_value").val();
  exhange_rate = $("#exhange_rate").val();
  new_transaction = new Transaction(name, value, exhange_rate);
  new_transaction.add_transaction($Transactions_list);
//declaration of this bottom is at the bottom  
  add_css();
 
}

// *** Functions to update main elements ***

// update exhange rate value and view
function exhange_rate_update()
{

  rate_value = format_currency_value($("#exhange_rate").val());
  $("#exhange_rate").val(rate_value);
  $.each(transactions_array, function()
        {
          this.update_zl(rate_value);
        }  
    );
  update_transaction_summary();
}

// update biggest transaction
function biggest_transaction_update(transaction)
{
  

  biggest_transaction = transaction;
  $Biggest_transaction.children("p").text("Nazwa największej transakcji: " + biggest_transaction.name + ", wartosc w euro: " + biggest_transaction.euro + ", wartosc w zlotowkach: " + biggest_transaction.zloty);

}

// update sum of transactions
function sum_of_transaction_update(sum)
{
    let exhange_rate = $("#exhange_rate").val();
    sum_in_zloty = format_currency_value(sum * exhange_rate);
    $Sum_of_transactions.children("p").text("Suma wszystkich transakcji wynosi: " + sum + " euro co odpowiada " + sum_in_zloty + " złotym.");
}

// function which update transaction summary: biggest tranaction and sum of transactions
function update_transaction_summary()
{
  let sum = 0;
  let biggest_transaction = 'brak transakcji';
// This loop finding a new biggest transaction and counting transaction sum in count in 
  $.each(transactions_array, function()
        { 
          if(biggest_transaction=="brak transakcji" || Number(biggest_transaction.euro)<Number(this.euro))
          { 
            biggest_transaction = this;
          }
          sum = sum + this.euro;
        }  
      );
// call update function
  biggest_transaction_update(biggest_transaction);
  sum_of_transaction_update(sum);
}



// *** Function for building application structure from elemnts ***
function create_application_structure()
{
    $(document).prepend("<body></body>");
    $Title.appendTo($("body"));
    $Exchange_rate_field.appendTo($("body"));
    $Transactions_field.appendTo($("body"));
    $Transactions_summary_field.appendTo($("body"));
}

// *** Add besic CSS style ***
function add_css()
{
    $("body").css(
        {
          "margin": "auto",
          "width": "80%",
          "padding": "50px"

        });

    $Transactions_list.css(
        {

        });

     $("td, th").css(
        {
          "border-bottom-style": "solid",
          "border-right-style": "solid",
          "border-color": "grey",
          "border-width": "1px",
          "padding": "5px",

        });

}


// *** Function to bind action with relevant events ***
function bind_events()
{
  $('#commit_transaction').bind('click', create_transaction);
  $('#exhange_rate').bind('change', exhange_rate_update);
}



// *** MAIN APPLICATION CODE - calling functions which create and manage application  ***
$(document).ready(
  function()
  {

    create_application_structure();
    add_css();
    bind_events();
     
  } );