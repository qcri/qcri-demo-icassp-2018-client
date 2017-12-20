from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse


# def index(request):
#     return HttpResponse("Hello, world! This is our first view.")


def index(request):
    # question = get_object_or_404(Question, pk=question_id)
    return render(request, 'did/index_1.html', {'data': 55})


# def icassp_demo_index(request):
#     # question = get_object_or_404(Question, pk=question_id)
#     return render(request, 'did/index_1.html', {'data': 55})