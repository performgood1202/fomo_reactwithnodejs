const stripe = require('stripe')

const Stripe = stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01'
})

const createCustomer = async (user) => {
  
  const {email,fName,lName} = user;
 

    try{
        const customer = await Stripe.customers.create({
            email:email,
            name:fName+" "+lName,
            description: 'New Customer',
        }).then((customer) => {


                return customer;

            
           
        }).catch(
              (error) => {
                return error.message;
              }
        )

    return customer;

  } catch(err) {
    let errMsg = null;
    console.log(err.message)
    throw err
    switch (err.type) {
      case 'StripeCardError':
        // A declined card error
        errMsg = err.message; // => e.g. "Your card's expiration year is invalid."
        break;
      case 'StripeRateLimitError':
        errMsg = 'Too many requests made to the API too quickly';
        break;
      case 'StripeInvalidRequestError':
        errMsg = "Invalid parameters were supplied to Stripe's API"
        break;
      case 'StripeAPIError':
        errMsg = "An error occurred internally with Stripe's API"
        break;
      case 'StripeConnectionError':
        errMsg = "Some kind of error occurred during the HTTPS communication"
        break;
      case 'StripeAuthenticationError':
        errMsg = "You probably used an incorrect API key"
        break;
      default:
        // errMsg = "Handle any other types of unexpected errors"
        errMsg = err.message
        break;
    }

    return errMsg;

  }

}

const createSubscription = async (customerID, priceId) => {

  const subscription = await Stripe.subscriptions.create({
    customer: customerID,
    items: [
      {price: priceId, quantity: 1},
    ],
  });

  return subscription;
}
const cancelStripeSubscription = async (stripe_subscription_id) => {

  try{
     const customerSubscription = await Stripe.subscriptions.del(
                                        stripe_subscription_id
                                      ).then((invoice) => {

                                          return invoice;

                                      }).catch(
                                            (error) => {
                                              return error.message;
                                            }
                                      )       

    return customerSubscription;

  } catch(err) {
    return err.message;
  }

 
}
const updateSubscription = async (body,stripe_subscription_id,stripe_customer_id,price_id) => {

  
  try{
    if(body.auto_renew == "1"){
       cancel_at_period_end = false;
       //billing_cycle_anchor = Math.floor(Date.now() / 1000);
    }else{
       cancel_at_period_end = true;
    }

   // console.log(stripe_customer_id)
        const customerSubscription = await Stripe.subscriptions.create({
                customer: stripe_customer_id,
                items: [
                  {price: price_id, quantity: 1},
                ],
                cancel_at_period_end:cancel_at_period_end,
            }).then((subscription) => {




              return subscription;
               
            }).catch(
                  (error) => {
                    return error.message;
                  }
            )  
        if(customerSubscription && customerSubscription.id){

            await Stripe.subscriptions.del(
                    stripe_subscription_id
                  ).then((invoice) => {

                    return ;

                  }).catch((error) => {
                    return;;
                  })
        }
      
        return customerSubscription;

  } catch(err) {
    return err.message;
  }

}


const addAcccount = async (session,body) => {

   try{



        const account = await Stripe.accounts.create({
          type: 'express',
          country: body.country,
          email: session.email,
          capabilities: {
            card_payments: {requested: true},
            transfers: {requested: true},
          },
          business_type: 'individual',
          business_profile: {
            mcc: session._id,
            url: "",
          },
          individual: {
            email: session.email,
            first_name: session.fName,
            last_name: session.lName,
          },

        }).then((account) => {

          return account;
             
        }).catch(
              (error) => {
                return error.message;
              }
        )


      return account;

  } catch(err) {
    return err.message;
   
  }
  
}
const addBankAccount = async (stripe_account_id,body) => {

   try{

      let parameters =  {
                object : 'bank_account',
                country : body.country,
                currency : 'EUR',
                account_holder_name : body.account_holder_name,
                account_number : body.account_number,
            };
     

        const account = await Stripe.accounts.createExternalAccount(
          stripe_account_id,{
            external_account : parameters
          }
        ).then((account) => {

          return account; 
             
        }).catch(
              (error) => {
                console.log(error.message)
                return error.message;
              }
        )
      return account;
  } catch(err) {
    return err.message;
   
  }
  
}

const fetchStripeBankDetails = async (stripe_account_id) => {

   try{

      const account =  await checkStripeAccountStatus(stripe_account_id);

      if(account && account.external_accounts && account.external_accounts.data && account.external_accounts.data){
        return account.external_accounts.data;
      }else{
         return "No Bank account exist!";
      }

      

     
/*
        const account = await Stripe.accounts.listExternalAccounts(
          stripe_account_id,
          {object: 'bank_account', limit: 3}
        ).then((account) => {

          return account; 
             
        }).catch(
              (error) => {
                return error.message;
              }
        )*/
      //  console.log(account)
      //return account;
  } catch(err) {
    return err.message;
   
  }
  
}

const loginStripeFunc = async (stripe_account_id) => {

   try{

     

        const account = await Stripe.accounts.createLoginLink(
          stripe_account_id
        ).then((account) => {

          return account; 
             
        }).catch(
              (error) => {
                return error.message;
              }
        )
       // console.log(account)
     return account;
  } catch(err) {
    return err.message;
   
  }
  
}
const setupStripe = async (stripe_account_id) => {

   try{

     

        const account = await Stripe.accountLinks.create({
          account: stripe_account_id,
          refresh_url: process.env.SITE_URL+"/owner/setting",
          return_url: process.env.SITE_URL+"/owner/setting?success=true",
          type: 'account_onboarding',
        }).then((account) => {

          return account; 
             
        }).catch(
              (error) => {
                return error.message;
              }
        )
     return account;
  } catch(err) {
    return err.message;
   
  }
  
}
const checkStripeAccountStatus = async (stripe_account_id) => {

  try{
        const account = await Stripe.accounts.retrieve(
          stripe_account_id,
        ).then((account) => {

          return account; 
             
        }).catch(
              (error) => {
                return error.message;
              }
        )
   // console.log(account)
     return account;

     
  } catch(err) {
    return err.message;
   
  }
  
}

const editBankDetails = async (stripe_account_id,bank_account_id) => {

   try{

      const loginStripeFunc_data = await loginStripeFunc(stripe_account_id);

      return loginStripeFunc_data;
     // return account;
  } catch(err) {
    return err.message;
   
  }
  
}
const deleteStripeAccount = async (stripe_account_id) => {

  try{
/*
        const account = await Stripe.accounts.del(
         stripe_account_id
        ).then((account) => {

          return account; 
             
        }).catch(
              (error) => {
                return error.message;
              }
        )
        return account; 
*/
         
     // return account;
  } catch(err) {
    return err.message;
   
  }
  
}

const createCheckoutSession = async (pr_name,price,stripe_customer_id) => {

  try{    
       const session = await Stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer: stripe_customer_id,
        line_items: [
          {
            price_data: {
              unit_amount: price * 100,
              currency: "EUR",
              product_data: {
                name: pr_name
              }
            },
            quantity: 1,
          }
        ],
        success_url: `${process.env.API_URL}/app/success_payment/{CHECKOUT_SESSION_ID}?stripe_payment=true`,
        cancel_url: `${process.env.SITE_URL}`
      }).then((session) => {

        return session; 
           
      }).catch(
            (error) => {
              return error.message;
            }
      )

    //  console.log(session)

      return session;

  } catch(err) {

    return err.message;
   
  }
}
const expireSession = async (checkout_session_id) => {

  try{    
        const session = await Stripe.checkout.sessions.expire(
                           checkout_session_id
                          ).then((session) => {

                          return session; 
                             
                        }).catch(
                              (error) => {
                                return error.message;
                              }
                        )

      console.log(session)

      return session;

  } catch(err) {

    return err.message;
   
  }
}
const createCardPayment = async (pr_name,price,stripe_customer_id,card) => {

  try{    
      const intents = await Stripe.paymentIntents.create({
        amount: price * 100,
        currency: 'EUR',
        payment_method_types: ['card'],
        customer: stripe_customer_id,
        capture_method: "automatic",
        customer: stripe_customer_id,
      }).then((intent) => {

        return intent; 
           
      }).catch(
            (error) => {
              return error.message;
            }
      )

      if(intents && intents.id){

            const transferData2 = await Stripe.paymentIntents.confirm(
              intents.id,
              {payment_method: card }
            ).then((transfer) => {
                       return transfer;
            }).catch(
                    (error) => {
                      return error.message;
                    }
            )
            return transferData2;

      }else{
        return intents;
      }

      

  } catch(err) {

    return err.message;
   
  }
}
const StripeSession = async (checkout_session_id) => {

  try{    
       const session = await Stripe.checkout.sessions.retrieve(
          checkout_session_id
       ).then((session) => {

        return session; 
           
      }).catch(
            (error) => {
              return error.message;
            }
      )

      return session;

  } catch(err) {

    return err.message;
   
  }
}

const createBillingSession = async (customer) => {
  const session = await Stripe.billingPortal.sessions.create({
    customer,
    return_url: 'https://localhost:4242'
  })
  return session
}

const getCustomerByID = async (id) => {
  const customer = await Stripe.customers.retrieve(id)
  return customer
}

const addNewCustomerAndSubscribe = async (user) => {
  const {email, name, source, price_id, auto_renew} = user;

  if(auto_renew == "1"){
     cancel_at_period_end = false;
     //billing_cycle_anchor = Math.floor(Date.now() / 1000);
  }else{
     cancel_at_period_end = true;
  }

    try{
        const customerSubscription = await Stripe.customers.create({
            email:email,
            name:name,
            description: 'New Customer',
        }).then((customer) => {


                return Stripe.customers.createSource(
                    customer.id,
                    {source: source}
                )

            
           
        }).then((source) => {
                 return Stripe.subscriptions.create({
                    customer: source.customer,
                    items: [
                      {price: price_id, quantity: 1},
                    ],
                    cancel_at_period_end:cancel_at_period_end,
                });
        }).catch(
              (error) => {
                return error.message;
              }
        )
    return customerSubscription;

  } catch(err) {
    let errMsg = null;
    console.log(err.message)
    throw err
    switch (err.type) {
      case 'StripeCardError':
        // A declined card error
        errMsg = err.message; // => e.g. "Your card's expiration year is invalid."
        break;
      case 'StripeRateLimitError':
        errMsg = 'Too many requests made to the API too quickly';
        break;
      case 'StripeInvalidRequestError':
        errMsg = "Invalid parameters were supplied to Stripe's API"
        break;
      case 'StripeAPIError':
        errMsg = "An error occurred internally with Stripe's API"
        break;
      case 'StripeConnectionError':
        errMsg = "Some kind of error occurred during the HTTPS communication"
        break;
      case 'StripeAuthenticationError':
        errMsg = "You probably used an incorrect API key"
        break;
      default:
        // errMsg = "Handle any other types of unexpected errors"
        errMsg = err.message
        break;
    }

    return errMsg;

  }

}
const refundSubscription = async (subscription) => {
  

    try{


        const subscription_data = await Stripe.subscriptions.retrieve(
                                      subscription.stripe_subscription_id
                                    ).then((subscription) => {

                                        return subscription;
                                    });

        if(subscription && subscription_data.latest_invoice){
              const invoice = await Stripe.invoices.retrieve(
                          subscription_data.latest_invoice
                        ).then((invoice) => {

                            return invoice;
                        });
              if(invoice && invoice.charge){
                  const refund = await Stripe.refunds.create({
                                  charge: invoice.charge,
                                }).catch(
                                      (error) => {
                                        return error.message;
                                      }
                                )  

              }
        } 

        const customerSubscription = await Stripe.subscriptions.del(
                                        subscription.stripe_subscription_id
                                      ).then((invoice) => {

                                          return invoice;

                                      }).catch(
                                            (error) => {
                                              return error.message;
                                            }
                                      )       

        return customerSubscription;                            

      
    //return customerSubscription;

  } catch(err) {
    errMsg = err.message
    return errMsg;

  }

}

const createWebhook = (rawBody, sig) => {
  const event = Stripe.webhooks.constructEvent(
    rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  )
  return event
}
const payPromotion = async (price,stripe_customer_id) => {


    let return_data = {transaction_id:null,error_message:null};

    try{


        var final_price  = price * 100;

        
        const charges =   await Stripe.charges.create({
            amount: final_price,     // Charing Rs 25
            description: 'Promotions',
            currency: 'EUR',
            customer: stripe_customer_id
        }).then((charge) => {
                 return charge;
        }).catch(
              (error) => {
                return error.message;
              }
        )

        if(charges.balance_transaction){
             
             return_data.transaction_id = charges.balance_transaction;
        }else{

          return_data.error_message = charges;

        }
        return return_data;


  } catch(err) {

    errMsg = err.message;
    return_data.error_message = errMsg;
     
    return return_data;

  }
}
const refundPayment = async (stripe_payment_id) => {



  try{

     const refund = await Stripe.refunds.create({
                                  payment_intent: stripe_payment_id,
                                }).then((refund) => {
                                         return refund;
                                }).catch(
                                      (error) => {
                                        return error.message;
                                      }
                                )  
     
    return refund;

  } catch(err) {

      return err.message;

  }
}

const transferToVendor = async (price,booking_id,stripe_account_id) => {



  try{

      /*  const transferData = await Stripe.balance.retrieve().then((transfer) => {
                     return transfer;
          }).catch(
                  (error) => {
                    return error.message;
                  }
          )
      console.log(transferData);*/

      const transferData = await Stripe.paymentIntents.create({
        amount: price * 100,
        currency: 'EUR',
        transfer_data: {
           destination : stripe_account_id
        }
      }).then((transfer) => {
                 return transfer;
      }).catch(
              (error) => {
                return error.message;
              }
      )

      return transferData;

  } catch(err) {

      return err.message;

  }
}
const transferToVendorConfirmData = async (stripe_payment_intent_id) => {



  try{

       const transferData2 = await Stripe.paymentIntents.confirm(
          stripe_payment_intent_id,
          {payment_method: 'pm_card_visa'}
        ).then((transfer) => {
                   return transfer;
        }).catch(
                (error) => {
                  return error.message;
                }
        )


      return transferData2;

  } catch(err) {

      return err.message;

  }
}
const getCard = async (stripe_customer_id) => {



  try{

       const cards =  await Stripe.customers.listPaymentMethods(
          stripe_customer_id,
          {type: 'card'}
        ).then((cards) => {
                   return cards;
        }).catch(
                (error) => {
                  return error.message;
                }
        )
        return cards;

  } catch(err) {

      return err.message;

  }
}
const saveCard = async (body,stripe_customer_id) => {

  

  try{

      const session = await Stripe.checkout.sessions.create({
        mode: 'setup',
        payment_method_types: ['card'],
        customer: stripe_customer_id,
        success_url: `${process.env.API_URL}/app/success_save_card/{CHECKOUT_SESSION_ID}?stripe_save_card=true`,
        cancel_url: `${process.env.SITE_URL}`
      }).then((session) => {

        return session; 
           
      }).catch(
            (error) => {
              return error.message;
            }
      )
      return session;

       /*const cardData =  await Stripe.paymentMethods.create(
          {
            "type" : "card",
            "card": {
                "number" : body.card_number,
                "exp_month" : body.exp_month,
                "exp_year" : body.exp_year,
                "cvc" : body.cvc,

            },

          }
        ).then((card) => {
                   return card;
        }).catch(
                (error) => {
                  return error.message;
                }
        )
        if(cardData && cardData.id){

            const cardattachData =  await Stripe.paymentMethods.attach(
              cardData.id,
              {customer: stripe_customer_id}
            ).then((card) => {
                       return card;
            }).catch(
                    (error) => {
                      return error.message;
                    }
            )

            return cardattachData;

        }else{
           return cardData;
        }*/

  } catch(err) {

      return err.message;

  }
}
const deleteCard = async (card_id) => {

  

  try{

        const cardData =  await Stripe.paymentMethods.detach(
          card_id
        ).then((card) => {
                   return card;
        }).catch(
                (error) => {
                  return error.message;
                }
        )
        return cardData;

  } catch(err) {

      return err.message;

  }
}

module.exports = {
  getCustomerByID,
  addNewCustomerAndSubscribe,
  createCheckoutSession,
  createCardPayment,
  createBillingSession,
  createWebhook,
  createSubscription,
  payPromotion,
  refundSubscription,
  addAcccount,
  addBankAccount,
  fetchStripeBankDetails,
  loginStripeFunc,
  setupStripe,
  checkStripeAccountStatus,
  editBankDetails,
  deleteStripeAccount,
  updateSubscription,
  cancelStripeSubscription,
  createCustomer,
  StripeSession,
  transferToVendor,
  refundPayment,
  transferToVendorConfirmData,
  getCard,
  saveCard,
  deleteCard,
  expireSession

}