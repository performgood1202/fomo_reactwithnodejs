const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');

let config = process.env;

const sendEmail = async ({ to, subject, html, from = config.EMAIL_FROM }) => {
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    await transporter.sendMail({ from, to, subject, html });
}

const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
           callback(err); 
           throw err;
            
        }
        else {
            callback(null, html);
        }
    });
};

const sendPasswordLinkEmail = async (user,token) => {
    const { email,id,fName,lName } = user; 
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));

    const link = process.env.SITE_URL+"/reset-password/"+id+"/"+token
    readHTMLFile('views/forgotPasswordMail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            link: link,
            name: fName+" "+lName,
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            to : email,
            subject : 'Forgot password',
            from : config.EMAIL_FROM,
            html : htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                //callback(error);
            } else{
                console.log(response);
            }
        });
    });
}
const sendLoginDetailsToClubEmail = async (user,site_url) => {
    const { email, password } = user.data; 
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    readHTMLFile('views/registerMail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            email: email,
            password: password,
            login_url: site_url+"/login",
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            to : email,
            subject : 'Club Account Login Details',
            from : config.EMAIL_FROM,
            html : htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                //callback(error);
            } else{
                //console.log(response);
            }
        });
    });
}


const sendClubInfoToAdmin = async (clubdata) => {
    const { name, email, phone, website } = clubdata;
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    readHTMLFile('views/clubRegister.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: name,
            email: email,
            phone: phone,
            website: website
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            to : 'sunil.kumar@xcelance.com',
            subject : 'New Club Register',
            from : config.EMAIL_FROM,
            html : htmlToSend
         };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                //callback(error);
            } else{
                //console.log(response);
            }
        });
    });    
}

const sendQueryMailToUser = async (record) => {
    const { name, email, phone, message } = record;
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    readHTMLFile('views/queryUserMail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: name,
            email: email,
            phone: phone,
            message: message
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from : config.EMAIL_FROM,
            to : email,
            subject : 'Thank you - Blank Interactive Nightlife',
            html : htmlToSend
         };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
               // callback(error);
            }
        });
    });
}

const sendUpdatePlanInfoToUser = async (user,site_url) => {
    const { email } = user; 
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    readHTMLFile('views/updatePlanMail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            login_url: site_url+"/login",
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            to : email,
            subject : 'Update plan',
            from : config.EMAIL_FROM,
            html : htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                //callback(error);
            } else{
                //console.log(response);
            }
        });
    });
}


const sendUpdatePlanInfoToAdmin = async (clubdata) => {
    const { name, email, phone, website } = clubdata;
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    readHTMLFile('views/updatePlanAdminMail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: name,
            email: email,
            phone: phone,
            website: website
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            to : 'sunil.kumar@xcelance.com',
            subject : 'Update Plan by Club owner',
            from : config.EMAIL_FROM,
            html : htmlToSend
         };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                //callback(error);
            } else{
               // console.log(response);
            }
        });
    });    
}

const sendCancelSubToUser = async (user,site_url) => {
    const { email } = user; 
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    readHTMLFile('views/cancelSubMail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            login_url: site_url+"/login",
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            to : email,
            subject : 'Cancel subscription',
            from : config.EMAIL_FROM,
            html : htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                //callback(error);
            } else{
                //console.log(response);
            }
        });
    });
}


const sendCancelSubToAdmin = async (clubdata) => {
    const { name, email, phone, website } = clubdata;
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    readHTMLFile('views/cancelSubAdminMail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: name,
            email: email,
            phone: phone,
            website: website
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            to : 'sunil.kumar@xcelance.com',
            subject : 'Cancel subscription by Club owner',
            from : config.EMAIL_FROM,
            html : htmlToSend
         };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                //callback(error);
            } else{
               // console.log(response);
            }
        });
    });    
}

const sendQueryMailToAdmin = async (record,admin_mail) => {
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    const { name, email, phone, message } = record;
    readHTMLFile('views/queryMail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: name,
            email: email,
            phone: phone,
            message: message
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: config.EMAIL_FROM,
            to : admin_mail,
            subject : 'Conatct us - Query',
            html : htmlToSend
         };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                //callback(error);
            }
        });
    });
}

const sendAcceptClubRequestEmail = async (user) => {

    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    const { email,password,site_url } = user; 
    readHTMLFile('views/acceptMail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            email: email,
            password: password,
            login_url: site_url+"/login",

        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from : config.EMAIL_FROM,
            to : email,
            subject : 'Accept club request by admin',
            html : htmlToSend
         };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
               // callback(error);
            }else{
               // console.log(response);
            }
        });
    });


}
const sendDeclineClubRequestEmail = async (club) => {
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    const { email } = club; 
    readHTMLFile('views/declineMail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            email: email,
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from : config.EMAIL_FROM,
            to : email,
            subject : 'Decline club request by admin',
            html : htmlToSend
         };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                //callback(error);
            }
        });
    });
}

const sendOrderInvoiceEmail = async (customer,booking_id,order_invoice_path) => {
    const transporter = nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    const { email,fName,lName } = customer; 
    let name = fName+" "+lName;
    readHTMLFile('views/OrderInvoiceMail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: name,
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from : config.EMAIL_FROM,
            to : "sunil.kumar@xcelance.com",
            subject : 'Order Invoice #00'+booking_id,
            html : htmlToSend,
            attachments: [{
                filename: '#00'+booking_id+'_invoice.pdf',
                path: order_invoice_path,
                contentType: 'application/pdf'
            }],
         };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                //callback(error);
            }
        });
    });
}

const checkSmtp = async () => {

    let result = { status: false, message: 'SMTP  Issue',data:null };


    const transporter = await nodemailer.createTransport(JSON.parse(config.SMTP_DETAILS));
    const smtp = await transporter.verify().then(async (verify) => {

        result.status = true;
        result.message = "";
        result.data = verify;
        return result;

    }).catch(
        (error) => {
            result.message = error.message;
            return result;
        }
    ) 

    return smtp;   
}

module.exports = {
    sendLoginDetailsToClubEmail,
    sendClubInfoToAdmin,
    sendQueryMailToUser,
    sendQueryMailToAdmin,
    sendAcceptClubRequestEmail,
    sendDeclineClubRequestEmail,
    checkSmtp,
    sendUpdatePlanInfoToUser,
    sendUpdatePlanInfoToAdmin,
    sendCancelSubToUser,
    sendCancelSubToAdmin,
    sendOrderInvoiceEmail,
    sendPasswordLinkEmail
}