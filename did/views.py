from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse


# def index(request):
#     return HttpResponse("Hello, world! This is our first view.")


def index(request):
    # question = get_object_or_404(Question, pk=question_id)
    return render(request, 'did/index_1.html', {'data': 55})


def icassp_demo_index(request):
    # question = get_object_or_404(Question, pk=question_id)
    return render(request, 'did/index.html', {'data': 55})

# IMPORTANT NOTES:
#  - Congratulations! Your certificate and chain have been saved at:
#    /etc/letsencrypt/live/dialectid.xyz/fullchain.pem
#    Your key file has been saved at:
#    /etc/letsencrypt/live/dialectid.xyz/privkey.pem
#    Your cert will expire on 2018-03-20. To obtain a new or tweaked
#    version of this certificate in the future, simply run certbot again
#    with the "certonly" option. To non-interactively renew *all* of
#    your certificates, run "certbot renew"
#  - If you like Certbot, please consider supporting our work by:
#
#    Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
#    Donating to EFF:                    https://eff.org/donate-le
#
#   --certfile                       certificate file for secured SSL connection
#   --keyfile                        key file for secured SSL connection
#
#
# --certfile=/etc/letsencrypt/live/dialectid.xyz/fullchain.pem --keyfile=/etc/letsencrypt/live/dialectid.xyz/privkey.pem