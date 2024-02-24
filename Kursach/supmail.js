    document.addEventListener('DOMContentLoaded', function(){
        const supform = document.getElementById('formSupport');
        formSupport.addEventListener('submit', formSend);

        async function formSend(e){
            e.preventDefault();
        }

    })